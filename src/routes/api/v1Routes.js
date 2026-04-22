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

const router = Router();

router.post('/records', enforcePolicy('create_record'), validateBody('createRecord'), postRecord);
router.get('/verify/:qrvid', getVerifyRecord);
router.post('/records/:qrvid/revoke', enforcePolicy('revoke_record'), validateBody('revokeRecord'), postRevokeRecord);
router.post('/tasks', validateBody('createTask'), postTask);
router.post('/workflows', validateBody('createWorkflow'), postWorkflow);
router.post('/policies', validateBody('createAuthorityPolicy'), postAuthorityPolicy);
router.post('/agents/profile', enforcePolicy('create_agent_profile'), validateBody('createAgentProfile'), postAgentProfile);
router.get('/agents/profile/:id', getAgentProfile);

export default router;
