import { Router } from 'express';
import verificationRoutes from './verificationRoutes.js';
import v1Routes from './api/v1Routes.js';
import executionV1Routes from './api/executionV1Routes.js';
import { renderLandingPage, renderVerificationResult } from '../controllers/verificationController.js';
import { healthHandler, versionHandler } from '../controllers/healthController.js';

const router = Router();

router.get('/health', healthHandler);
router.get('/version', versionHandler);
router.use('/api/v1', v1Routes);
router.use('/v1', executionV1Routes);
router.get('/', renderLandingPage);
router.use('/verify', verificationRoutes);
router.get('/:qrvid', renderVerificationResult);

export default router;
