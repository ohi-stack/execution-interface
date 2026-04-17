import { Router } from 'express';
import { getVerifyRecord, postRecord, postRevokeRecord } from '../../controllers/api/v1Controller.js';
import { getConvertedOnegodianTime, getCurrentOnegodianTime } from '../../controllers/api/onegodianController.js';
import { validateBody } from '../../middleware/validateSchema.js';
import { enforcePolicy } from '../../services/policyService.js';

const router = Router();

router.post('/records', enforcePolicy('create_record'), validateBody('createRecord'), postRecord);
router.get('/verify/:qrvid', getVerifyRecord);
router.post('/records/:qrvid/revoke', enforcePolicy('revoke_record'), validateBody('revokeRecord'), postRevokeRecord);
router.get('/ot/current', getCurrentOnegodianTime);
router.get('/ot/convert', getConvertedOnegodianTime);

export default router;
