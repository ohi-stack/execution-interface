export type MemberRole = 'free' | 'pro' | 'founder' | 'admin';
export type PlanCode = 'monthly' | 'pro' | 'founder';

export type User = {
  id: string;
  email: string;
  name?: string;
  passwordHash: string;
  role: MemberRole;
  createdAt: string;
  updatedAt: string;
};

export type Subscription = {
  id: string;
  userId: string;
  plan: PlanCode;
  status: 'active' | 'past_due' | 'canceled' | 'incomplete';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductType = 'pdf' | 'course' | 'toolkit';

export type Product = {
  id: string;
  name: string;
  type: ProductType;
  priceCents: number;
};

export type Order = {
  id: string;
  userId: string;
  productId: string;
  amountCents: number;
  currency: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  stripePaymentIntentId?: string;
  createdAt: string;
  updatedAt: string;
};

export type DownloadToken = {
  token: string;
  orderId: string;
  userId: string;
  expiresAt: string;
  consumedAt?: string;
};

export type BillingEvent = {
  id: string;
  type: string;
  payload: unknown;
  createdAt: string;
};
