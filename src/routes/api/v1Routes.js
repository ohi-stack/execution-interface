import { Router } from 'express';
import {
  getRegistryRecord,
  getRegistryRecords,
  getVerifyRecord,
  postRecord,
  postRegistryCreate,
  postRevoke,
  postRevokeRecord,
  postSeedDemo,
} from '../../controllers/api/v1Controller.js';
import { validateBody } from '../../middleware/validateSchema.js';
import { requireIssuerAuth } from '../../middleware/issuerAuth.js';
import { requireJwtAuth } from '../../middleware/jwtAuth.js';
import { verifyRateLimit } from '../../middleware/rateLimit.js';
import { enforcePolicy } from '../../services/policyService.js';

const router = Router();

router.post('/records', requireJwtAuth(['issuer', 'admin']), requireIssuerAuth, enforcePolicy('create_record'), validateBody('createRecord'), postRecord);
router.post('/records/:qrvid/revoke', requireJwtAuth(['admin']), requireIssuerAuth, enforcePolicy('revoke_record'), validateBody('revokeRecord'), postRevokeRecord);
router.post('/registry/create', requireJwtAuth(['issuer', 'admin']), requireIssuerAuth, enforcePolicy('create_record'), validateBody('createRecord'), postRegistryCreate);
router.get('/verify/:qrvid', verifyRateLimit, getVerifyRecord);
router.post('/revoke', requireJwtAuth(['admin']), requireIssuerAuth, enforcePolicy('revoke_record'), validateBody('revokeRecord'), postRevoke);
router.get('/registry/:qrvid', getRegistryRecord);
router.get('/registry', getRegistryRecords);
router.post('/seed/demo', requireJwtAuth(['admin']), postSeedDemo);

export default router;
