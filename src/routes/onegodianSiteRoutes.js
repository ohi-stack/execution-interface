import { Router } from 'express';
import {
  getAlgorithmDocPage,
  getOrgHomepage,
  getPositioningDocPage,
  getProductDetailPage,
  getProductsPage,
  getSystemPromptDocPage,
} from '../controllers/onegodianSiteController.js';

const router = Router();

router.get('/onegodian', getOrgHomepage);
router.get('/products', getProductsPage);
router.get('/products/:slug', getProductDetailPage);
router.get('/docs/algorithm', getAlgorithmDocPage);
router.get('/docs/system-prompt', getSystemPromptDocPage);
router.get('/docs/positioning', getPositioningDocPage);

export default router;
