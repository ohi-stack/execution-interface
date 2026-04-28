import { Router } from 'express';
import { z } from 'zod';

import { env } from '../config/env';
import { persistence } from '../lib/persistence';
import { membershipPlans, stripeClient } from '../lib/stripe';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';

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

router.post('/webhook', async (req, res, next) => {
  try {
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

  await prisma.billingEvent.upsert({
    where: { id: parsed.data.id },
    update: { type: parsed.data.type, payload: parsed.data.data.object },
    create: {
      id: parsed.data.id,
      type: parsed.data.type,
      payload: parsed.data.data.object
    }
  await persistence.createBillingEvent({
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
      const role = plan === 'monthly' ? 'pro' : plan;

      await prisma.user.update({
        where: { id: userId },
        data: { role }
      });

      await prisma.subscription.upsert({
        where: { userId },
        update: {
          plan,
          status: 'active',
          stripeCustomerId: typeof object.customer === 'string' ? object.customer : undefined,
          stripeSubscriptionId: typeof object.subscription === 'string' ? object.subscription : undefined
        },
        create: {
      const user = await persistence.findUserById(userId);
      if (user) {
        await persistence.activateUserSubscription({
          userId,
          role: plan === 'monthly' ? 'pro' : plan,
          plan: plan,
          stripeCustomerId: typeof object.customer === 'string' ? object.customer : undefined,
          stripeSubscriptionId: typeof object.subscription === 'string' ? object.subscription : undefined
        }
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

  const subscription = await prisma.subscription.findFirst({ where: { userId: req.auth.userId } });
  const subscription = await persistence.getSubscriptionByUserId(req.auth.userId);

  res.status(200).json({
    ok: true,
    subscription: subscription ?? null
  });
  } catch (error) {
    next(error);
  }
});

export default router;
