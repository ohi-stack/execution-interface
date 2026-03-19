import { Router } from 'express';
import verificationRoutes from './verificationRoutes.js';
import { renderLandingPage, renderVerificationResult } from '../controllers/verificationController.js';
import { healthHandler } from '../controllers/healthController.js';

const router = Router();

router.get('/health', healthHandler);
router.get('/', renderLandingPage);
router.use('/verify', verificationRoutes);
router.get('/:qrvid', renderVerificationResult);

export default router;
