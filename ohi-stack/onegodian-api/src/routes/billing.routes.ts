import { Router } from 'express';
import { z } from 'zod';

import { env } from '../config/env';
import { persistence } from '../lib/persistence';
import { stripeClient, stripePlanPrices, stripeReady } from '../lib/stripe';
import { requireAuth } from '../middleware/auth';

const router = Router();

const checkoutSchema = z.object({
  plan: z.enum(['monthly', 'pro', 'founder'])
});

router.post('/checkout', requireAuth, async (req, res, next) => {
  try {
    if (!req.auth) {
      const error = new Error('Missing auth context') as Error & { status?: number; code?: string };
      error.status = 401;
      error.code = 'unauthorized';
      next(error);
      return;
    }

    const parsed = checkoutSchema.safeParse(req.body);
    if (!parsed.success) {
      const error = new Error('Request validation failed') as Error & { status?: number; code?: string; details?: unknown };
      error.status = 400;
      error.code = 'validation_error';
      error.details = parsed.error.flatten();
      next(error);
      return;
    }

    const plan = parsed.data.plan;

    if (!stripeReady || !stripeClient) {
      res.status(200).json({
        ok: true,
        mode: 'mock',
        sessionId: `mock_session_${plan}`,
        checkoutUrl: `${env.appUrl}/billing/mock-checkout/${plan}`
      });
      return;
    }

    const priceId = stripePlanPrices[plan];
    if (!priceId) {
      const error = new Error('Stripe price is not configured for plan') as Error & { status?: number; code?: string };
      error.status = 503;
      error.code = 'billing_unavailable';
      next(error);
      return;
    }

    const session = await stripeClient.checkout.sessions.create({
      mode: 'subscription',
      success_url: `${env.appUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.appUrl}/billing/cancel`,
      customer_email: req.auth.email,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        userId: req.auth.userId,
        plan
      }
    });

    res.status(200).json({ ok: true, mode: 'stripe', checkoutUrl: session.url, sessionId: session.id });
  } catch (error) {
    next(error);
  }
});

router.post('/webhook', async (req, res, next) => {
  try {
    if (!env.stripeWebhookSecret) {
      const event = req.body as { id?: string; type?: string; data?: { object?: Record<string, unknown> } };
      if (!event.id || !event.type || !event.data?.object) {
        const error = new Error('Invalid mock webhook payload') as Error & { status?: number; code?: string };
        error.status = 400;
        error.code = 'invalid_request';
        next(error);
        return;
      }

      await persistence.createBillingEvent({
        id: event.id,
        type: event.type,
        payload: event.data.object,
        createdAt: new Date().toISOString()
      });

      res.status(200).json({ ok: true, received: true, mode: 'mock' });
      return;
    }

    const signature = req.headers['stripe-signature'];
    if (typeof signature !== 'string') {
      const error = new Error('Missing Stripe signature') as Error & { status?: number; code?: string };
      error.status = 400;
      error.code = 'invalid_signature';
      next(error);
      return;
    }

    if (!stripeClient) {
      const error = new Error('Stripe client is not configured') as Error & { status?: number; code?: string };
      error.status = 503;
      error.code = 'billing_unavailable';
      next(error);
      return;
    }

    const rawBody = req.rawBody;
    if (!rawBody) {
      const error = new Error('Webhook raw body is required') as Error & { status?: number; code?: string };
      error.status = 400;
      error.code = 'invalid_request';
      next(error);
      return;
    }

    let event;
    try {
      event = stripeClient.webhooks.constructEvent(rawBody, signature, env.stripeWebhookSecret);
    } catch {
      const error = new Error('Invalid Stripe signature') as Error & { status?: number; code?: string };
      error.status = 400;
      error.code = 'invalid_signature';
      next(error);
      return;
    }

    await persistence.createBillingEvent({
      id: event.id,
      type: event.type,
      payload: event.data.object as unknown as Record<string, unknown>,
      createdAt: new Date().toISOString()
    });

    if (event.type === 'checkout.session.completed') {
      const object = event.data.object as { metadata?: { userId?: string; plan?: string }; customer?: string; subscription?: string };
      const userId = typeof object.metadata?.userId === 'string' ? object.metadata.userId : undefined;
      const plan = object.metadata?.plan;

      if (userId && (plan === 'monthly' || plan === 'pro' || plan === 'founder')) {
        await persistence.activateUserSubscription({
          userId,
          role: plan === 'monthly' ? 'pro' : plan,
          plan,
          stripeCustomerId: typeof object.customer === 'string' ? object.customer : undefined,
          stripeSubscriptionId: typeof object.subscription === 'string' ? object.subscription : undefined
        });
      }
    }

    if (event.type === 'customer.subscription.created'
      || event.type === 'customer.subscription.updated'
      || event.type === 'customer.subscription.deleted'
      || event.type === 'invoice.payment_succeeded'
      || event.type === 'invoice.payment_failed') {
      // persisted for auditability via createBillingEvent above.
    }

    res.status(200).json({ ok: true, received: true, mode: 'stripe' });
  } catch (error) {
    next(error);
  }
});

router.get('/status', requireAuth, async (req, res, next) => {
  try {
    if (!req.auth) {
      const error = new Error('Missing auth context') as Error & { status?: number; code?: string };
      error.status = 401;
      error.code = 'unauthorized';
      next(error);
      return;
    }

    const subscription = await persistence.getSubscriptionByUserId(req.auth.userId);
    res.status(200).json({ ok: true, subscription: subscription ?? null });
  } catch (error) {
    next(error);
  }
});

export default router;
