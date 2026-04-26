import { Router } from 'express';
import v1Routes from './api/v1Routes.js';
import omosRoutes from './api/omosRoutes.js';
import verificationRoutes from './verificationRoutes.js';
import {
  renderLandingPage,
  renderSystemArchitecturePage,
  renderVerificationResult,
} from '../controllers/verificationController.js';
import {
  renderBookDemoPage,
  renderCertificateVerificationPage,
  renderMembershipVerificationPage,
  renderPricingPage,
} from '../controllers/marketingController.js';
import { healthHandler, metricsHandler, readyHandler, versionHandler } from '../controllers/healthController.js';
import { renderDashboardPage } from '../controllers/dashboardController.js';

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
router.get('/version', versionHandler);
router.get('/metrics', metricsHandler);

// 2) API/core
router.use('/api/v1', v1Routes);
router.use('/api/omos', omosRoutes);

// 3) pages/ui
router.get('/', renderLandingPage);
router.get('/system-architecture', renderSystemArchitecturePage);
router.get('/pricing', renderPricingPage);
router.get('/book-demo', renderBookDemoPage);
router.get('/certificate-verification', renderCertificateVerificationPage);
router.get('/membership-verification', renderMembershipVerificationPage);
router.get('/dashboard', renderDashboardPage);
router.use('/verify', verificationRoutes);
router.get('/:qrvid', renderVerificationResult);

export default router;
