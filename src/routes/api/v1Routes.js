import { Router } from 'express';
import {
  getAgentProfile,
  getVerifyRecord,
  postAgentProfile,
  postAuthorityPolicy,
  postRecord,
  postRevokeRecord,
  postTask,
  postWorkflow,
} from '../../controllers/api/v1Controller.js';
import { validateBody } from '../../middleware/validateSchema.js';
import { enforcePolicy } from '../../services/policyService.js';
import { requireIssuerApiKey } from '../../middleware/issuerAuth.js';
import { rateLimit } from '../../middleware/rateLimit.js';

const router = Router();

router.post('/records', requireIssuerApiKey, enforcePolicy('create_record'), validateBody('createRecord'), postRecord);
router.post('/registry/create', requireIssuerApiKey, enforcePolicy('create_record'), validateBody('createRecord'), postRecord);
router.get('/verify/:qrvid', rateLimit({ windowMs: 60_000, max: 30 }), getVerifyRecord);
router.post('/records/:qrvid/revoke', requireIssuerApiKey, enforcePolicy('revoke_record'), validateBody('revokeRecord'), postRevokeRecord);
router.post('/revoke/:qrvid', requireIssuerApiKey, enforcePolicy('revoke_record'), validateBody('revokeRecord'), postRevokeRecord);
router.post('/tasks', validateBody('createTask'), postTask);
router.post('/workflows', validateBody('createWorkflow'), postWorkflow);
router.post('/policies', validateBody('createAuthorityPolicy'), postAuthorityPolicy);
router.post('/agents/profile', enforcePolicy('create_agent_profile'), validateBody('createAgentProfile'), postAgentProfile);
router.get('/agents/profile/:id', getAgentProfile);

export default router;
