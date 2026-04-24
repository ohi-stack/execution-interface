import { Router } from 'express';
import {
  getAgentProfile,
  getVerifyRecord,
  postAgentProfile,
  postAuthorityPolicy,
  postRecord,
  postRevokeRecord,
  postRevokeRecordByBody,
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
import { validateZodBody, validateZodParams } from '../../middleware/validateZod.js';
import { requireApiKey } from '../../middleware/apiKeyAuth.js';
import { simpleRateLimit } from '../../middleware/rateLimit.js';
import { createRecordSchema, qrvidParamSchema, revokeByBodySchema, revokeByPathSchema } from '../../schemas/qrvApiSchemas.js';

const router = Router();


const writeLimiter = simpleRateLimit({ windowMs: 60_000, maxRequests: 60, keyPrefix: 'qrv-write' });
const readLimiter = simpleRateLimit({ windowMs: 60_000, maxRequests: 240, keyPrefix: 'qrv-read' });

router.post('/registry/create', requireApiKey, writeLimiter, enforcePolicy('create_record'), validateZodBody(createRecordSchema), postRecord);
router.get('/verify/:qrvid', readLimiter, validateZodParams(qrvidParamSchema), getVerifyRecord);
router.post('/revoke', requireApiKey, writeLimiter, enforcePolicy('revoke_record'), validateZodBody(revokeByBodySchema), postRevokeRecordByBody);

router.post('/records', requireApiKey, writeLimiter, enforcePolicy('create_record'), validateBody('createRecord'), postRecord);
router.post('/records/:qrvid/revoke', requireApiKey, writeLimiter, validateZodParams(qrvidParamSchema), enforcePolicy('revoke_record'), validateZodBody(revokeByPathSchema), postRevokeRecord);
router.post('/tasks', validateBody('createTask'), postTask);
router.post('/workflows', validateBody('createWorkflow'), postWorkflow);
router.post('/policies', validateBody('createAuthorityPolicy'), postAuthorityPolicy);
router.post('/agents/profile', enforcePolicy('create_agent_profile'), validateBody('createAgentProfile'), postAgentProfile);
router.get('/agents/profile/:id', getAgentProfile);

export default router;
