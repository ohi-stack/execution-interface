import { Router } from 'express';
import {
  alignHandler,
  classifyHandler,
  decisionRunHandler,
  timestampConvertHandler,
} from '../../controllers/omosController.js';

const router = Router();

router.post('/classify', classifyHandler);
router.post('/align', alignHandler);
router.post('/timestamp/convert', timestampConvertHandler);
router.post('/decision/run', decisionRunHandler);

export default router;
