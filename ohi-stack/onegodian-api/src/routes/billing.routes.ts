import { Router } from 'express';
import { z } from 'zod';

import { env } from '../config/env';
import { persistence } from '../lib/persistence';
import { membershipPlans, stripeClient } from '../lib/stripe';
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

    const plan = membershipPlans[parsed.data.plan];
    const session = await stripeClient.checkout.sessions.create({
      mode: 'subscription',
      success_url: `${env.appUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.appUrl}/billing/cancel`,
      customer_email: req.auth.email,
      line_items: [{
        price_data: {
          currency: 'usd',
          recurring: { interval: 'month' },
          unit_amount: plan.amountCents,
          product_data: { name: plan.name }
        },
        quantity: 1
      }],
      metadata: {
        userId: req.auth.userId,
        plan: parsed.data.plan
      }
    });

    res.status(200).json({ ok: true, checkoutUrl: session.url, sessionId: session.id });
  } catch (error) {
    next(error);
  }
});

router.post('/webhook', async (req, res, next) => {
  try {
    const signature = req.headers['stripe-signature'];
    if (typeof signature !== 'string') {
      const error = new Error('Missing Stripe signature') as Error & { status?: number; code?: string };
      error.status = 400;
      error.code = 'invalid_signature';
      next(error);
      return;
    }

    if (!env.stripeWebhookSecret) {
      const error = new Error('Webhook secret is not configured') as Error & { status?: number; code?: string };
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

    const event = stripeClient.webhooks.constructEvent(rawBody, signature, env.stripeWebhookSecret);

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

    res.status(200).json({ ok: true, received: true });
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
