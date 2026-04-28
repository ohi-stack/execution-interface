import { Router } from 'express';

import { prisma } from '../lib/prisma';

const router = Router();

router.get('/stats', async (_req, res) => {
  const [usersRaw, subscriptionsRaw, ordersRaw, billingEvents] = await Promise.all([
    prisma.user.findMany({ select: { role: true } }),
    prisma.subscription.findMany({ select: { status: true } }),
    prisma.order.findMany({ select: { paymentStatus: true, amountCents: true } }),
    prisma.billingEvent.count()
  ]);

  const users = usersRaw as Array<{ role: 'free' | 'pro' | 'founder' | 'admin' }>;
  const subscriptions = subscriptionsRaw as Array<{ status: 'active' | 'past_due' | 'canceled' | 'incomplete' }>;
  const orders = ordersRaw as Array<{ paymentStatus: 'pending' | 'paid' | 'failed'; amountCents: number }>;
  const paidOrders = orders.filter((order) => order.paymentStatus === 'paid');

  res.status(200).json({
    ok: true,
    stats: {
      users: {
        total: users.length,
        free: users.filter((user) => user.role === 'free').length,
        pro: users.filter((user) => user.role === 'pro').length,
        founder: users.filter((user) => user.role === 'founder').length,
        admin: users.filter((user) => user.role === 'admin').length
      },
      subscriptions: {
        total: subscriptions.length,
        active: subscriptions.filter((entry) => entry.status === 'active').length,
        canceled: subscriptions.filter((entry) => entry.status === 'canceled').length
      },
      revenue: {
        paidOrders: paidOrders.length,
        totalCents: paidOrders.reduce((sum, order) => sum + order.amountCents, 0)
      },
      billingEvents,
      generatedAt: new Date().toISOString()
    }
  });
import { persistence } from '../lib/persistence';

const router = Router();

router.get('/stats', async (_req, res, next) => {
  try {
    const stats = await persistence.getAdminStats();
    res.status(200).json({
      ok: true,
      stats: {
        ...stats,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
