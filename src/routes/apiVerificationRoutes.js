import { Router } from 'express';
import { verifyRecordHandler } from '../controllers/registryController.js';

const router = Router();

router.get('/:qrvid', verifyRecordHandler);

export default router;
