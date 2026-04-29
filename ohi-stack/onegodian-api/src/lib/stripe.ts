import Stripe from 'stripe';

import { env } from '../config/env';

export const membershipPlans = {
  monthly: { name: 'Monthly Membership' },
  pro: { name: 'Pro Membership' },
  founder: { name: 'Founder Membership' }
} as const;

export type MembershipPlan = keyof typeof membershipPlans;

export const stripeClient = env.stripeSecretKey
  ? new Stripe(env.stripeSecretKey)
  : null;

export const stripeReady = Boolean(
  stripeClient
  && env.stripePrices.monthly
  && env.stripePrices.pro
  && env.stripePrices.founder
);

export const stripePlanPrices: Record<MembershipPlan, string | undefined> = {
  monthly: env.stripePrices.monthly,
  pro: env.stripePrices.pro,
  founder: env.stripePrices.founder
};
