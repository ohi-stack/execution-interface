import { Router } from 'express';
import {
  getNowHandler,
  postGregorianToOTHandler,
  postNormalizeHandler,
  postOTToGregorianHandler,
} from '../controllers/timeController.js';

const router = Router();

router.get('/now', getNowHandler);
router.post('/convert/gregorian-to-ot', postGregorianToOTHandler);
router.post('/convert/ot-to-gregorian', postOTToGregorianHandler);
router.post('/normalize', postNormalizeHandler);

export default router;
