import { Router } from 'express';
import { healthCheck, serviceIndex } from '../controllers/healthController.js';

const router = Router();
router.get('/', serviceIndex);
router.get('/health', healthCheck);

export default router;
