import express from 'express';
import { createRecord, getRecords, revokeRecord } from '../controllers/recordsController.js';
import { requireIssuerAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireIssuerAuth);
router.post('/create', createRecord);
router.get('/', getRecords);
router.post('/revoke', revokeRecord);

export default router;
