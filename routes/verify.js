import express from 'express';
import { verifyRecord } from '../controllers/verifyController.js';

const router = express.Router();

router.get('/:qrvid', verifyRecord);
router.post('/', verifyRecord);

export default router;
