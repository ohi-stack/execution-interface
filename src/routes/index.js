import { Router } from 'express';
import verificationRoutes from './verificationRoutes.js';
import v1Routes from './api/v1Routes.js';
import { renderLandingPage, renderVerificationResult } from '../controllers/verificationController.js';
import { healthHandler } from '../controllers/healthController.js';
import omosRoutes from './api/omosRoutes.js';

const router = Router();

router.get('/health', healthHandler);
router.use('/api/v1', v1Routes);
router.use('/api/omos', omosRoutes);
router.get('/', renderLandingPage);
router.use('/verify', verificationRoutes);
router.get('/:qrvid', renderVerificationResult);

export default router;
