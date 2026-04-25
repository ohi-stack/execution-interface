import Stripe from 'stripe';
import { getSubscription, saveSubscription } from './accDb.js';

const planCatalog = {
  starter: { priceId: process.env.STRIPE_PRICE_STARTER || 'price_starter', amount_usd: 99 },
  growth: { priceId: process.env.STRIPE_PRICE_GROWTH || 'price_growth', amount_usd: 299 },
  pro: { priceId: process.env.STRIPE_PRICE_PRO || 'price_pro', amount_usd: 999 },
};

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' }) : null;

export const getPlans = () => ({
  starter: { name: 'Starter', price: '$99/mo' },
  growth: { name: 'Growth', price: '$299/mo' },
  pro: { name: 'Pro', price: '$999/mo' },
});

export const createCheckout = async ({ issuer_id, plan = 'starter', trial_days = 14 }) => {
  const selected = planCatalog[plan];
  if (!selected) throw new Error('Unsupported plan');

  if (!stripe) {
    const mock = { issuer_id, plan, status: 'trialing', trial_days, checkout_url: `https://mock.stripe.local/checkout/${issuer_id}` };
    saveSubscription(issuer_id, mock);
    return mock;
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: selected.priceId, quantity: 1 }],
    subscription_data: { trial_period_days: trial_days },
    success_url: `${process.env.ISSUER_APP_URL || 'https://issuer.qrv.network'}/billing?status=success`,
    cancel_url: `${process.env.ISSUER_APP_URL || 'https://issuer.qrv.network'}/billing?status=cancel`,
    metadata: { issuer_id, plan },
  });

  const out = { issuer_id, plan, status: 'checkout_created', checkout_url: session.url, session_id: session.id };
  saveSubscription(issuer_id, out);
  return out;
};

export const updatePlan = (issuer_id, plan) => {
  const current = getSubscription(issuer_id) || { issuer_id, status: 'inactive' };
  const updated = { ...current, plan, status: 'active', updated_at_utc: new Date().toISOString() };
  saveSubscription(issuer_id, updated);
  return updated;
};

export const getPlanStatus = (issuer_id) => getSubscription(issuer_id) || { issuer_id, status: 'inactive', plan: null };
