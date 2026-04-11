import { Router } from 'express';
import { getPublicVerifyRecord, postPublicRecord } from '../controllers/api/v1Controller.js';

const router = Router();

router.post('/records', postPublicRecord);
router.get('/verify/:qrvid', getPublicVerifyRecord);

export default router;
