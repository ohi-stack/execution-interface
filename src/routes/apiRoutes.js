import { Router } from 'express';
import recordsRoutes from './recordsRoutes.js';
import apiVerificationRoutes from './apiVerificationRoutes.js';
import { apiHealthHandler, databaseProbeHandler } from '../controllers/apiHealthController.js';

const router = Router();

router.get('/health', apiHealthHandler);
router.get('/test-db', databaseProbeHandler);
router.use('/records', recordsRoutes);
router.use('/verify', apiVerificationRoutes);

export default router;
