import crypto from 'node:crypto';

/** @typedef {'digital'|'service'} ProductType */

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} slug
 * @property {string} name
 * @property {string} description
 * @property {number} priceUsdCents
 * @property {ProductType} type
 * @property {boolean} active
 * @property {string[]} tags
 */

/**
 * @typedef {'pending'|'paid'|'failed'} OrderStatus
 */

/**
 * @typedef {Object} Order
 * @property {string} id
 * @property {string} productId
 * @property {string} productSlug
 * @property {number} amountUsdCents
 * @property {OrderStatus} status
 * @property {string} createdAtUtc
 * @property {string|null} stripeSessionId
 */

const products = [
  {
    id: 'prod_algorithm_v1',
    slug: 'onegodian-algorithm-reference',
    name: 'Onegodian Algorithm Reference v1.0',
    description: 'Operational reference pack for the four-layer Onegodian Algorithm framework.',
    priceUsdCents: 4900,
    type: 'digital',
    active: true,
    tags: ['protocol', 'experience', 'community', 'orientation'],
  },
  {
    id: 'prod_system_prompt_v1',
    slug: 'onegodian-ai-system-prompt-v1',
    name: 'Onegodian AI System Prompt v1.0',
    description: 'Structured prompt pack with stage-aware response framework and documented-source constraints.',
    priceUsdCents: 2900,
    type: 'digital',
    active: true,
    tags: ['llm', 'prompting', 'governance'],
  },
  {
    id: 'prod_ots_v5',
    slug: 'onegodian-timekeeping-ots-v5',
    name: 'Onegodian Timekeeping System™ OTS-V5',
    description: 'Corrected-edition OT conversion helpers and implementation guide for UTC/Gregorian systems.',
    priceUsdCents: 1900,
    type: 'digital',
    active: true,
    tags: ['timekeeping', 'utc', 'gregorian'],
  },
];

const orders = new Map();

export const listProducts = () => products.filter((product) => product.active);

export const getProductBySlug = (slug) => products.find((product) => product.slug === slug && product.active) || null;

export const getOrderById = (id) => orders.get(id) || null;

export const createCheckoutSession = ({ productSlug, successUrlBase, cancelUrlBase }) => {
  const product = getProductBySlug(productSlug);

  if (!product) {
    const error = new Error('Product not found');
    error.code = 'PRODUCT_NOT_FOUND';
    throw error;
  }

  const orderId = crypto.randomUUID();
  const stripeSessionId = process.env.STRIPE_SECRET_KEY ? `cs_test_${crypto.randomBytes(8).toString('hex')}` : null;

  /** @type {Order} */
  const order = {
    id: orderId,
    productId: product.id,
    productSlug: product.slug,
    amountUsdCents: product.priceUsdCents,
    status: 'pending',
    createdAtUtc: new Date().toISOString(),
    stripeSessionId,
  };

  orders.set(orderId, order);

  const success = `${successUrlBase.replace(/\/$/, '')}/orders/${orderId}?status=success`;
  const cancel = `${cancelUrlBase.replace(/\/$/, '')}/orders/${orderId}?status=cancelled`;

  return {
    checkoutUrl: stripeSessionId ? `https://checkout.stripe.com/pay/${stripeSessionId}` : success,
    order,
    successUrl: success,
    cancelUrl: cancel,
  };
};

export const applyWebhookPaymentEvent = ({ orderId, eventType }) => {
  const order = getOrderById(orderId);

  if (!order) {
    const error = new Error('Order not found');
    error.code = 'ORDER_NOT_FOUND';
    throw error;
  }

  if (eventType === 'checkout.session.completed') {
    order.status = 'paid';
  } else if (eventType === 'checkout.session.expired') {
    order.status = 'failed';
  }

  return order;
};

export const getDownloadForProduct = ({ productId, orderId }) => {
  const order = getOrderById(orderId);

  if (!order || order.productId !== productId || order.status !== 'paid') {
    const error = new Error('No downloadable asset available for this order/product combination');
    error.code = 'DOWNLOAD_UNAVAILABLE';
    throw error;
  }

  return {
    productId,
    downloadUrl: `${process.env.PUBLIC_BASE_URL || 'http://localhost:3000'}/downloads/assets/${productId}.zip`,
    expiresAtUtc: new Date(Date.now() + (1000 * 60 * 60)).toISOString(),
  };
};
