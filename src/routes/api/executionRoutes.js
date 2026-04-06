import { Router } from 'express';
import { postExecute } from '../../controllers/api/executionController.js';

const router = Router();

router.post('/execute', postExecute);

export default router;
