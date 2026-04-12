import { Router } from 'express';
import {
  getDownloadByProductIdHandler,
  getOrderByIdHandler,
  getProductBySlugHandler,
  getProductsHandler,
  postCheckoutSessionHandler,
  postStripeWebhookHandler,
} from '../controllers/onegodianApiController.js';

const router = Router();

router.get('/products', getProductsHandler);
router.get('/products/:slug', getProductBySlugHandler);
router.post('/checkout/session', postCheckoutSessionHandler);
router.post('/webhooks/stripe', postStripeWebhookHandler);
router.get('/orders/:id', getOrderByIdHandler);
router.get('/downloads/:productId', getDownloadByProductIdHandler);

export default router;
