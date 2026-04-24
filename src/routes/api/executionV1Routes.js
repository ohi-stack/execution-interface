import { Router } from 'express';
import { postExecute, getExecutionById } from '../../controllers/api/executionController.js';
import { validateBody } from '../../middleware/validateSchema.js';

const router = Router();

router.post('/execute', validateBody('executeRequest'), postExecute);
router.get('/executions/:id', getExecutionById);

export default router;
