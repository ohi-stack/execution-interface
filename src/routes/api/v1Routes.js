import { Router } from 'express';
import { getVerifyRecord, postRecord, postRevokeRecord } from '../../controllers/api/v1Controller.js';
import { validateBody } from '../../middleware/validateSchema.js';
import { authenticateToken } from '../../middleware/auth.js';
import { enforcePolicy } from '../../services/policyService.js';

const router = Router();

router.post('/records', authenticateToken, enforcePolicy('create_record'), validateBody('createRecord'), postRecord);
router.get('/verify/:qrvid', getVerifyRecord);
router.post('/records/:qrvid/revoke', authenticateToken, enforcePolicy('revoke_record'), validateBody('revokeRecord'), postRevokeRecord);

export default router;
