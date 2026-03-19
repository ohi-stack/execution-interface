import { Router } from 'express';
import { renderVerificationResult, submitVerificationRequest } from '../controllers/verificationController.js';

const router = Router();

router.post('/', submitVerificationRequest);
router.get('/:qrvid', renderVerificationResult);

export default router;
