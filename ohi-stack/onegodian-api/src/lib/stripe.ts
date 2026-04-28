import Stripe from 'stripe';

import { env } from '../config/env';

export const stripeClient = new Stripe(env.stripeSecretKey);

export const membershipPlans = {
  monthly: { amountCents: 1900, name: 'Monthly Membership' },
  pro: { amountCents: 4900, name: 'Pro Membership' },
  founder: { amountCents: 9900, name: 'Founder Membership' }
} as const;
