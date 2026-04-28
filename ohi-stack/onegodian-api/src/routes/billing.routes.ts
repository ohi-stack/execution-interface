import { Router } from 'express';
import { z } from 'zod';

import { env } from '../config/env';
import { membershipPlans, stripeClient } from '../lib/stripe';
import { requireAuth } from '../middleware/auth';
import { store } from '../lib/store';

const router = Router();

const checkoutSchema = z.object({
  plan: z.enum(['monthly', 'pro', 'founder'])
});

router.post('/checkout', requireAuth, async (req, res, next) => {
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

  try {
    const session = await stripeClient.checkout.sessions.create({
      mode: 'subscription',
      success_url: `${env.appUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.appUrl}/billing/cancel`,
      customer_email: req.auth.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            recurring: { interval: 'month' },
            unit_amount: plan.amountCents,
            product_data: { name: plan.name }
          },
          quantity: 1
        }
      ],
      metadata: {
        userId: req.auth.userId,
        plan: parsed.data.plan
      }
    });

    res.status(200).json({
      ok: true,
      checkoutUrl: session.url,
      sessionId: session.id
    });
  } catch (error) {
    next(error);
  }
});

router.post('/webhook', (req, res, next) => {
  const eventSchema = z.object({
    id: z.string(),
    type: z.string(),
    data: z.object({ object: z.record(z.any()) })
  });

  const parsed = eventSchema.safeParse(req.body);
  if (!parsed.success) {
    const error = new Error('Webhook validation failed') as Error & { status?: number; code?: string; details?: unknown };
    error.status = 400;
    error.code = 'validation_error';
    error.details = parsed.error.flatten();
    next(error);
    return;
  }

  store.billingEvents.push({
    id: parsed.data.id,
    type: parsed.data.type,
    payload: parsed.data.data.object,
    createdAt: new Date().toISOString()
  });

  if (parsed.data.type === 'checkout.session.completed') {
    const object = parsed.data.data.object;
    const userId = typeof object.metadata?.userId === 'string' ? object.metadata.userId : undefined;
    const plan = object.metadata?.plan;

    if (userId && (plan === 'monthly' || plan === 'pro' || plan === 'founder')) {
      const user = store.users.get(userId);
      if (user) {
        user.role = plan === 'monthly' ? 'pro' : plan;
        store.createOrUpdateSubscription({
          userId,
          plan,
          status: 'active',
          stripeCustomerId: typeof object.customer === 'string' ? object.customer : undefined,
          stripeSubscriptionId: typeof object.subscription === 'string' ? object.subscription : undefined
        });
      }
    }
  }

  res.status(200).json({ ok: true, received: true });
});

router.get('/status', requireAuth, (req, res, next) => {
  if (!req.auth) {
    const error = new Error('Missing auth context') as Error & { status?: number; code?: string };
    error.status = 401;
    error.code = 'unauthorized';
    next(error);
    return;
  }

  const subscription = Array.from(store.subscriptions.values()).find((entry) => entry.userId === req.auth?.userId);

  res.status(200).json({
    ok: true,
    subscription: subscription ?? null
  });
});

export default router;
