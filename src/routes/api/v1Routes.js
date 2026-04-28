import { Router } from 'express';
import {
  getAgentProfile,
  getAuthorityModelHandler,
  getDecisionByIdHandler,
  getVerifyRecord,
  listDecisionsHandler,
  postAgentProfile,
  postAuthorize,
  postApiKeyProvision,
  postAuthorityPolicy,
  postIssuerProvision,
  postRecord,
  postRevokeRecord,
  postRevokeRecordByBody,
  postTask,
  postWorkflow,
} from '../../controllers/api/v1Controller.js';
import {
  getBillingStatus,
  getPricing,
  postBillingCheckout,
  postBillingPlanChange,
  postIssueWizard,
  postIssuerFirstApiKey,
  postIssuerProfile,
  postIssuerSignup,
  postVerifyEmail,
} from '../../controllers/api/launchController.js';
import { validateBody } from '../../middleware/validateSchema.js';
import authorityRoutes from './authorityRoutes.js';
import { enforcePolicy } from '../../services/policyService.js';
import { validateZodBody, validateZodParams } from '../../middleware/validateZod.js';
import { requireApiKey } from '../../middleware/apiKeyAuth.js';
import { simpleRateLimit } from '../../middleware/rateLimit.js';
import { requireJwt } from '../../middleware/jwtAuth.js';
import {
  apiKeyProvisionSchema,
  checkoutSchema,
  createRecordSchema,
  issuerProfileSchema,
  issuerProvisionSchema,
  issuerSignupSchema,
  planChangeSchema,
  qrvidParamSchema,
  revokeByBodySchema,
  revokeByPathSchema,
  verifyEmailSchema,
} from '../../schemas/qrvApiSchemas.js';

const router = Router();

router.use('/', authorityRoutes);

const writeLimiter = simpleRateLimit({ windowMs: 60_000, maxRequests: 60, keyPrefix: 'qrv-write' });
const readLimiter = simpleRateLimit({ windowMs: 60_000, maxRequests: 120, keyPrefix: 'qrv-read' });

router.post('/registry/create', requireApiKey, writeLimiter, enforcePolicy('create_record'), validateZodBody(createRecordSchema), postRecord);
router.get('/verify/:qrvid', readLimiter, validateZodParams(qrvidParamSchema), getVerifyRecord);
router.post('/revoke', requireApiKey, writeLimiter, enforcePolicy('revoke_record'), validateZodBody(revokeByBodySchema), postRevokeRecordByBody);

router.post('/issuer/certificates', requireApiKey, requireJwt({ roles: ['issuer', 'admin'] }), writeLimiter, enforcePolicy('create_record'), validateZodBody(createRecordSchema), postRecord);
router.post('/issuer/certificates/:qrvid/revoke', requireApiKey, requireJwt({ roles: ['issuer', 'admin'] }), writeLimiter, validateZodParams(qrvidParamSchema), enforcePolicy('revoke_record'), validateZodBody(revokeByPathSchema), postRevokeRecord);

router.post('/admin/issuers', requireJwt({ roles: ['admin'] }), validateZodBody(issuerProvisionSchema), postIssuerProvision);
router.post('/admin/api-keys', requireJwt({ roles: ['admin'] }), validateZodBody(apiKeyProvisionSchema), postApiKeyProvision);

router.get('/billing/plans', getPricing);
router.post('/billing/checkout', validateZodBody(checkoutSchema), postBillingCheckout);
router.post('/billing/:issuer_id/plan', validateZodBody(planChangeSchema), postBillingPlanChange);
router.get('/billing/:issuer_id/status', getBillingStatus);

router.post('/onboarding/signup', validateZodBody(issuerSignupSchema), postIssuerSignup);
router.post('/onboarding/verify-email', validateZodBody(verifyEmailSchema), postVerifyEmail);
router.post('/onboarding/:issuer_id/profile', validateZodBody(issuerProfileSchema), postIssuerProfile);
router.post('/onboarding/:issuer_id/api-key', postIssuerFirstApiKey);
router.get('/onboarding/:issuer_id/issue-first-certificate', postIssueWizard);

router.post('/tasks', validateBody('createTask'), postTask);
router.post('/workflows', validateBody('createWorkflow'), postWorkflow);
router.post('/policies', validateBody('createAuthorityPolicy'), postAuthorityPolicy);
router.post('/agents/profile', validateBody('createAgentProfile'), enforcePolicy('create_agent_profile'), postAgentProfile);
router.get('/agents/profile/:id', getAgentProfile);
router.get('/authority/model', getAuthorityModelHandler);
router.post('/authorize', postAuthorize);
router.get('/decisions/:decisionId', getDecisionByIdHandler);
router.get('/decisions', listDecisionsHandler);

export default router;
