import { randomUUID } from 'crypto';

import { prisma } from './prisma';
import { BillingEvent, DownloadToken, Order, Product, Subscription, User } from '../types/domain';

const toUser = (row: {
  id: string;
  email: string;
  name: string | null;
  passwordHash: string;
  role: User['role'];
  createdAt: Date;
  updatedAt: Date;
}): User => ({
  ...row,
  name: row.name ?? undefined,
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString()
});

const toSubscription = (row: {
  id: string;
  userId: string;
  plan: Subscription['plan'];
  status: Subscription['status'];
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}): Subscription => ({
  ...row,
  stripeCustomerId: row.stripeCustomerId ?? undefined,
  stripeSubscriptionId: row.stripeSubscriptionId ?? undefined,
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString()
});

const toOrder = (row: {
  id: string;
  userId: string;
  productId: string;
  amountCents: number;
  currency: string;
  paymentStatus: Order['paymentStatus'];
  stripePaymentIntentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}): Order => ({
  ...row,
  stripePaymentIntentId: row.stripePaymentIntentId ?? undefined,
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString()
});

const toDownloadToken = (row: {
  token: string;
  orderId: string;
  userId: string;
  expiresAt: Date;
  consumedAt: Date | null;
}): DownloadToken => ({
  token: row.token,
  orderId: row.orderId,
  userId: row.userId,
  expiresAt: row.expiresAt.toISOString(),
  consumedAt: row.consumedAt?.toISOString()
});

const toBillingEvent = (row: { id: string; type: string; payload: unknown; createdAt: Date }): BillingEvent => ({
  id: row.id,
  type: row.type,
  payload: row.payload,
  createdAt: row.createdAt.toISOString()
});

const defaultSeedProducts: Product[] = [
  { id: 'product_pdf_foundations', name: 'Onegodian Foundations PDF', type: 'pdf', priceCents: 1900 },
  { id: 'product_course_alignment', name: 'Alignment Mastery Course', type: 'course', priceCents: 4900 },
  { id: 'product_toolkit_builder', name: 'Builder Toolkit', type: 'toolkit', priceCents: 9900 }
];

export const persistence = {
  async ensureSeedData(): Promise<void> {
    const productCount = await prisma.product.count();
    if (productCount > 0) {
      return;
    }

    await prisma.product.createMany({
      data: defaultSeedProducts
    });
  },

  async healthcheck(): Promise<boolean> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  },

  async createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const created = await prisma.user.create({
      data: {
        ...user,
        email: user.email.toLowerCase()
      }
    });

    return toUser(created);
  },

  async findUserByEmail(email: string): Promise<User | undefined> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    return user ? toUser(user) : undefined;
  },

  async findUserById(userId: string): Promise<User | undefined> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return user ? toUser(user) : undefined;
  },

  async updateUserRole(userId: string, role: User['role']): Promise<void> {
    await prisma.user.update({ where: { id: userId }, data: { role } });
  },

  async createOrUpdateSubscription(subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>): Promise<Subscription> {
    const upserted = await prisma.subscription.upsert({
      where: { userId: subscription.userId },
      update: {
        plan: subscription.plan,
        status: subscription.status,
        stripeCustomerId: subscription.stripeCustomerId,
        stripeSubscriptionId: subscription.stripeSubscriptionId
      },
      create: subscription
    });

    return toSubscription(upserted);
  },

  async getSubscriptionByUserId(userId: string): Promise<Subscription | undefined> {
    const subscription = await prisma.subscription.findUnique({ where: { userId } });
    return subscription ? toSubscription(subscription) : undefined;
  },

  async listProducts(): Promise<Product[]> {
    await this.ensureSeedData();
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'asc' } });
    return products.map((product: { id: string; name: string; type: Product['type']; priceCents: number }) => ({
      id: product.id,
      name: product.name,
      type: product.type,
      priceCents: product.priceCents
    }));
  },

  async getProductById(productId: string): Promise<Product | undefined> {
    await this.ensureSeedData();
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return undefined;
    }

    return {
      id: product.id,
      name: product.name,
      type: product.type,
      priceCents: product.priceCents
    };
  },

  async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const created = await prisma.order.create({ data: order });
    return toOrder(created);
  },

  async getOrderById(orderId: string): Promise<Order | undefined> {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    return order ? toOrder(order) : undefined;
  },

  async createDownloadToken(input: Omit<DownloadToken, 'token'>): Promise<DownloadToken> {
    const token = randomUUID();
    const created = await prisma.downloadToken.create({
      data: {
        token,
        orderId: input.orderId,
        userId: input.userId,
        expiresAt: new Date(input.expiresAt),
        consumedAt: input.consumedAt ? new Date(input.consumedAt) : null
      }
    });

    return toDownloadToken(created);
  },

  async getDownloadTokenByToken(token: string): Promise<DownloadToken | undefined> {
    const entry = await prisma.downloadToken.findUnique({ where: { token } });
    return entry ? toDownloadToken(entry) : undefined;
  },

  async createBillingEvent(event: BillingEvent): Promise<BillingEvent> {
    const created = await prisma.billingEvent.upsert({
      where: { id: event.id },
      update: { type: event.type, payload: event.payload as object },
      create: {
        id: event.id,
        type: event.type,
        payload: event.payload as object,
        createdAt: new Date(event.createdAt)
      }
    });

    return toBillingEvent(created);
  },

  async activateUserSubscription(input: {
    userId: string;
    role: User['role'];
    plan: Subscription['plan'];
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
  }): Promise<void> {
    await prisma.$transaction(async (tx: any) => {
      await tx.user.update({ where: { id: input.userId }, data: { role: input.role } });
      await tx.subscription.upsert({
        where: { userId: input.userId },
        update: {
          plan: input.plan,
          status: 'active',
          stripeCustomerId: input.stripeCustomerId,
          stripeSubscriptionId: input.stripeSubscriptionId
        },
        create: {
          userId: input.userId,
          plan: input.plan,
          status: 'active',
          stripeCustomerId: input.stripeCustomerId,
          stripeSubscriptionId: input.stripeSubscriptionId
        }
      });
    });
  },

  async getAdminStats(): Promise<{
    users: { total: number; free: number; pro: number; founder: number; admin: number };
    subscriptions: { total: number; active: number; canceled: number };
    revenue: { paidOrders: number; totalCents: number };
    billingEvents: number;
  }> {
    const [usersTotal, subscriptionsTotal, billingEvents, paidRevenue, freeUsers, proUsers, founderUsers, adminUsers, activeSubs, canceledSubs] =
      await Promise.all([
        prisma.user.count(),
        prisma.subscription.count(),
        prisma.billingEvent.count(),
        prisma.order.aggregate({ where: { paymentStatus: 'paid' }, _count: { _all: true }, _sum: { amountCents: true } }),
        prisma.user.count({ where: { role: 'free' } }),
        prisma.user.count({ where: { role: 'pro' } }),
        prisma.user.count({ where: { role: 'founder' } }),
        prisma.user.count({ where: { role: 'admin' } }),
        prisma.subscription.count({ where: { status: 'active' } }),
        prisma.subscription.count({ where: { status: 'canceled' } })
      ]);

    return {
      users: {
        total: usersTotal,
        free: freeUsers,
        pro: proUsers,
        founder: founderUsers,
        admin: adminUsers
      },
      subscriptions: {
        total: subscriptionsTotal,
        active: activeSubs,
        canceled: canceledSubs
      },
      revenue: {
        paidOrders: paidRevenue._count._all,
        totalCents: paidRevenue._sum.amountCents ?? 0
      },
      billingEvents
    };
  },
};
