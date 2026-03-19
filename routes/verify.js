import { Router } from 'express';
import { verifyRecordHandler } from '../controllers/verifyController.js';

const router = Router();

router.get('/:id', verifyRecordHandler);

export default router;
