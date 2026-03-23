import express from 'express';
import { createRecord, revokeRecord } from '../controllers/recordsController.js';
import { verifyRecord } from '../controllers/verifyController.js';
import { requireIssuerAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/create', requireIssuerAuth, createRecord);
router.post('/revoke', requireIssuerAuth, revokeRecord);
router.post('/verify', verifyRecord);

export default router;
