import { Router } from 'express';
import v1Routes from './api/v1Routes.js';
import omosRoutes from './api/omosRoutes.js';
import verificationRoutes from './verificationRoutes.js';
import {
  renderLandingPage,
  renderSystemArchitecturePage,
  renderVerificationResult,
} from '../controllers/verificationController.js';
import { healthHandler, readyHandler } from '../controllers/healthController.js';

const router = Router();

// 1) auth/system
router.get('/health', healthHandler);
router.get('/healthz', healthHandler);
router.get('/readyz', readyHandler);

// 2) API/core
router.use('/api/v1', v1Routes);
router.use('/api/omos', omosRoutes);

// 3) pages/ui
router.get('/', renderLandingPage);
router.get('/system-architecture', renderSystemArchitecturePage);
router.use('/verify', verificationRoutes);
router.get('/:qrvid', renderVerificationResult);

export default router;
