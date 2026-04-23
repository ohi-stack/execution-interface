import Stripe from 'stripe';
import { getEnv } from '@/lib/env';

const env = getEnv();

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  appInfo: {
    name: 'ONEGODIAN IDENTITY ENGINE'
  }
});
