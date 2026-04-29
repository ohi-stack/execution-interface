import { ProductConfig } from '@/lib/types';

export const PRODUCTS: ProductConfig[] = [
  {
    tier: 'starter',
    label: 'Starter',
    description: 'Perfect for first declaration unlock.',
    amount: 1200,
    stripePriceIdEnv: 'STRIPE_PRICE_STARTER',
    downloads: 1,
    premiumSeal: false
  },
  {
    tier: 'premium',
    label: 'Premium',
    description: 'Best conversion package with enhanced seal detail.',
    amount: 4900,
    stripePriceIdEnv: 'STRIPE_PRICE_PREMIUM',
    downloads: 5,
    premiumSeal: true
  },
  {
    tier: 'founder',
    label: 'Founder',
    description: 'Founder-tier pack with unlimited lifetime re-generation.',
    amount: 19900,
    stripePriceIdEnv: 'STRIPE_PRICE_FOUNDER',
    downloads: 999,
    premiumSeal: true
  }
];
