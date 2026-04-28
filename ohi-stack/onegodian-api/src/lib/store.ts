import { randomUUID } from 'crypto';

import { BillingEvent, DownloadToken, Order, Product, Subscription, User } from '../types/domain';

const now = () => new Date().toISOString();

const defaultProducts: Product[] = [
  { id: 'product_pdf_foundations', name: 'Onegodian Foundations PDF', type: 'pdf', priceCents: 1900 },
  { id: 'product_course_alignment', name: 'Alignment Mastery Course', type: 'course', priceCents: 4900 },
  { id: 'product_toolkit_builder', name: 'Builder Toolkit', type: 'toolkit', priceCents: 9900 }
];

class MemoryStore {
  users = new Map<string, User>();
  subscriptions = new Map<string, Subscription>();
  orders = new Map<string, Order>();
  downloadTokens = new Map<string, DownloadToken>();
  billingEvents: BillingEvent[] = [];
  products = new Map(defaultProducts.map((product) => [product.id, product]));

  createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const created: User = {
      ...user,
      id: randomUUID(),
      createdAt: now(),
      updatedAt: now()
    };
    this.users.set(created.id, created);
    return created;
  }

  findUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find((user) => user.email.toLowerCase() === email.toLowerCase());
  }

  createOrUpdateSubscription(subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>): Subscription {
    const existing = Array.from(this.subscriptions.values()).find((entry) => entry.userId === subscription.userId);
    if (existing) {
      const updated: Subscription = { ...existing, ...subscription, updatedAt: now() };
      this.subscriptions.set(updated.id, updated);
      return updated;
    }

    const created: Subscription = {
      ...subscription,
      id: randomUUID(),
      createdAt: now(),
      updatedAt: now()
    };
    this.subscriptions.set(created.id, created);
    return created;
  }

  createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order {
    const created: Order = {
      ...order,
      id: randomUUID(),
      createdAt: now(),
      updatedAt: now()
    };
    this.orders.set(created.id, created);
    return created;
  }

  markOrderPaid(orderId: string, paymentIntentId?: string): Order | undefined {
    const order = this.orders.get(orderId);
    if (!order) {
      return undefined;
    }

    const updated: Order = {
      ...order,
      paymentStatus: 'paid',
      stripePaymentIntentId: paymentIntentId,
      updatedAt: now()
    };
    this.orders.set(orderId, updated);
    return updated;
  }

  createDownloadToken(input: Omit<DownloadToken, 'token'>): DownloadToken {
    const token = randomUUID();
    const payload: DownloadToken = {
      token,
      ...input
    };
    this.downloadTokens.set(token, payload);
    return payload;
  }
}

export const store = new MemoryStore();
