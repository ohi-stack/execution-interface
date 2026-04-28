import { Router } from 'express';

import { store } from '../lib/store';

const router = Router();

router.get('/stats', (_req, res) => {
  const users = Array.from(store.users.values());
  const subscriptions = Array.from(store.subscriptions.values());
  const orders = Array.from(store.orders.values());
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
      billingEvents: store.billingEvents.length,
      generatedAt: new Date().toISOString()
    }
  });
});

export default router;
