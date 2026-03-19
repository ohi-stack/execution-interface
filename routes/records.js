import { Router } from 'express';
import { createRecordHandler } from '../controllers/recordsController.js';

const router = Router();

router.post('/', createRecordHandler);

export default router;
