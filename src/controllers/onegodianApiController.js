import {
  applyWebhookPaymentEvent,
  createCheckoutSession,
  getDownloadForProduct,
  getOrderById,
  getProductBySlug,
  listProducts,
} from '../services/onegodianCommerceService.js';

const sendError = (res, status, code, message) => res.status(status).json({ code, message });

export const getProductsHandler = (_req, res) => {
  res.json({ products: listProducts() });
};

export const getProductBySlugHandler = (req, res) => {
  const product = getProductBySlug(req.params.slug);

  if (!product) {
    return sendError(res, 404, 'NOT_FOUND', 'Product not found');
  }

  return res.json({ product });
};

export const postCheckoutSessionHandler = (req, res) => {
  const { productSlug } = req.body ?? {};
  if (!productSlug) {
    return sendError(res, 400, 'INVALID_REQUEST', 'productSlug is required');
  }

  try {
    const session = createCheckoutSession({
      productSlug,
      successUrlBase: process.env.CHECKOUT_SUCCESS_BASE_URL || process.env.PUBLIC_BASE_URL || 'http://localhost:3000',
      cancelUrlBase: process.env.CHECKOUT_CANCEL_BASE_URL || process.env.PUBLIC_BASE_URL || 'http://localhost:3000',
    });

    return res.status(201).json(session);
  } catch (error) {
    if (error.code === 'PRODUCT_NOT_FOUND') {
      return sendError(res, 404, error.code, error.message);
    }

    return sendError(res, 500, 'INTERNAL_ERROR', 'Unable to create checkout session');
  }
};

export const postStripeWebhookHandler = (req, res) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.header('stripe-signature');

  if (webhookSecret && !signature) {
    return sendError(res, 401, 'INVALID_SIGNATURE', 'stripe-signature header is required when webhook secret is configured');
  }

  const { orderId, type } = req.body ?? {};
  if (!orderId || !type) {
    return sendError(res, 400, 'INVALID_REQUEST', 'orderId and type are required');
  }

  try {
    const order = applyWebhookPaymentEvent({ orderId, eventType: type });
    return res.json({ received: true, order });
  } catch (error) {
    if (error.code === 'ORDER_NOT_FOUND') {
      return sendError(res, 404, error.code, error.message);
    }

    return sendError(res, 500, 'INTERNAL_ERROR', 'Unable to process webhook event');
  }
};

export const getOrderByIdHandler = (req, res) => {
  const order = getOrderById(req.params.id);

  if (!order) {
    return sendError(res, 404, 'NOT_FOUND', 'Order not found');
  }

  return res.json({ order });
};

export const getDownloadByProductIdHandler = (req, res) => {
  const orderId = req.query.orderId;
  if (!orderId) {
    return sendError(res, 400, 'INVALID_REQUEST', 'orderId query parameter is required');
  }

  try {
    const download = getDownloadForProduct({ productId: req.params.productId, orderId });
    return res.json({ download });
  } catch (error) {
    if (error.code === 'DOWNLOAD_UNAVAILABLE') {
      return sendError(res, 403, error.code, error.message);
    }

    return sendError(res, 500, 'INTERNAL_ERROR', 'Unable to resolve download link');
  }
};
