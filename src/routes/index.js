import { Router } from 'express';
import v1Routes from './api/v1Routes.js';
import omosRoutes from './api/omosRoutes.js';
import verificationRoutes from './verificationRoutes.js';
import {
  renderLandingPage,
  renderSystemArchitecturePage,
  renderVerificationResult,
} from '../controllers/verificationController.js';
import { healthHandler, readyHandler } from '../controllers/healthController.js';
import { postRecord, postRevokeRecord } from '../controllers/api/v1Controller.js';
import { validateBody } from '../middleware/validateSchema.js';
import { requireIssuerApiKey } from '../middleware/issuerAuth.js';
import { enforcePolicy } from '../services/policyService.js';
import { requireAdminApiKey } from '../middleware/adminAuth.js';
import { createIssuerHandler, rotateIssuerKeyHandler, suspendIssuerHandler } from '../controllers/adminController.js';
import { metricsHandler } from '../controllers/metricsController.js';

const router = Router();

router.use((req, res, next) => {
  if (/%0a|%0d/i.test(req.originalUrl)) {
    return res.status(400).json({
      error: 'Invalid request path',
      code: 'INVALID_PATH',
      details: ['Encoded newline characters are not allowed in request URLs'],
      timestamp_utc: new Date().toISOString(),
    });
  }
  return next();
});


// 1) auth/system
router.get('/health', healthHandler);
router.get('/healthz', healthHandler);
router.get('/ready', readyHandler);
router.get('/readyz', readyHandler);
router.get('/version', (_req, res) => {
  res.status(200).json({
    service: 'onegodian-verify-portal',
    version: process.env.npm_package_version || '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

const router = Router();

const redirectIssuerLogin = (req, res) => {
  const issuerUrl = (process.env.ISSUER_APP_URL || 'https://issuer.qrv.network').trim();
  const signinUrl = new URL('/signin', issuerUrl);

  const redirectParam = req.query?.redirect || req.query?.next || '';
  if (typeof redirectParam === 'string' && redirectParam.trim()) {
    const cleaned = redirectParam.replace(/[\r\n]/g, '').trim();
    signinUrl.searchParams.set('redirect', cleaned);
  }

  return res.redirect(302, signinUrl.toString());
};

// 1) auth/system
router.get('/health', healthHandler);
router.get('/login*', redirectIssuerLogin);
router.get('/healthz', healthHandler);
router.get('/readyz', readyHandler);

// 2) API/core
router.post('/registry/create', requireIssuerApiKey, enforcePolicy('create_record'), validateBody('createRecord'), postRecord);
router.post('/api/v1/revoke/:qrvid', requireIssuerApiKey, enforcePolicy('revoke_record'), validateBody('revokeRecord'), postRevokeRecord);
router.use('/api/v1', v1Routes);
router.use('/api/omos', omosRoutes);
router.get('/metrics', metricsHandler);
router.post('/api/v1/admin/issuers', requireAdminApiKey, createIssuerHandler);
router.post('/api/v1/admin/issuers/:issuerId/rotate-key', requireAdminApiKey, rotateIssuerKeyHandler);
router.post('/api/v1/admin/issuers/:issuerId/suspend', requireAdminApiKey, suspendIssuerHandler);


// 3) pages/ui
router.get('/', renderLandingPage);
router.get('/system-architecture', renderSystemArchitecturePage);
router.use('/verify', verificationRoutes);
router.get('/login', (_req, res) => res.redirect('/'));
router.get('/dashboard', (_req, res) => res.status(503).json({
  error: 'Issuer dashboard is not served from this node',
  code: 'ISSUER_UI_NOT_DEPLOYED',
  details: ['Deploy issuer UI service to issuer.qrv.network and map /dashboard there'],
  timestamp_utc: new Date().toISOString(),
}));
router.get('/:qrvid', renderVerificationResult);

export default router;
