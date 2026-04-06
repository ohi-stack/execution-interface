import { Router } from 'express';
import { createRecordHandler } from '../controllers/registryController.js';

const router = Router();

router.post('/', createRecordHandler);

export default router;
