import { randomUUID } from 'crypto';

import { Router } from 'express';
import { z } from 'zod';

import { persistence } from '../lib/persistence';

const router = Router();

const checkoutSchema = z.object({
  productId: z.string().min(1)
});

router.get('/', async (_req, res, next) => {
  try {
    const products = await persistence.listProducts();
  res.status(200).json({
    ok: true,
    products
  });
  } catch (error) {
    next(error);
  }
});

router.post('/checkout', async (req, res, next) => {
  try {
    if (!req.auth) {
      const error = new Error('Missing auth context') as Error & { status?: number; code?: string };
      error.status = 401;
      error.code = 'unauthorized';
      next(error);
      return;
    }

    const parsed = checkoutSchema.safeParse(req.body);
    if (!parsed.success) {
      const error = new Error('Request validation failed') as Error & { status?: number; code?: string; details?: unknown };
      error.status = 400;
      error.code = 'validation_error';
      error.details = parsed.error.flatten();
      next(error);
      return;
    }

    const product = await persistence.getProductById(parsed.data.productId);
    if (!product) {
      const error = new Error('Product not found') as Error & { status?: number; code?: string };
      error.status = 404;
      error.code = 'not_found';
      next(error);
      return;
    }

    const order = await persistence.createOrder({
      userId: req.auth.userId,
      productId: product.id,
      amountCents: product.priceCents,
      currency: 'usd',
      paymentStatus: 'paid',
      stripePaymentIntentId: `pi_mock_${randomUUID()}`
    });

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const token = await persistence.createDownloadToken({
      orderId: order.id,
      userId: req.auth.userId,
      expiresAt
    });

    res.status(201).json({
      ok: true,
      order,
      fulfillment: {
        downloadToken: token.token,
        expiresAt,
        emailDelivery: 'queued-placeholder'
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/downloads/:token', async (req, res, next) => {
  try {
    if (!req.auth) {
      const error = new Error('Missing auth context') as Error & { status?: number; code?: string };
      error.status = 401;
      error.code = 'unauthorized';
      next(error);
      return;
    }

    const token = await persistence.getDownloadTokenByToken(req.params.token);
    if (!token || token.userId !== req.auth.userId) {
      const error = new Error('Download token not found') as Error & { status?: number; code?: string };
      error.status = 404;
      error.code = 'not_found';
      next(error);
      return;
    }

    const expired = new Date(token.expiresAt).getTime() <= Date.now();
    if (expired) {
      const error = new Error('Download token expired') as Error & { status?: number; code?: string };
      error.status = 410;
      error.code = 'token_expired';
      next(error);
      return;
    }

    const order = await persistence.getOrderById(token.orderId);
    const product = order ? await persistence.getProductById(order.productId) : undefined;

    res.status(200).json({
      ok: true,
      download: {
        token: token.token,
        expiresAt: token.expiresAt,
        product,
        url: `${req.protocol}://${req.get('host')}/assets/downloads/${token.token}`
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
