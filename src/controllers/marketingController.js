import { backupConfigured } from '../config/runtime.js';
import { renderMarketingView } from '../views/marketingView.js';

const model = {
  backupReminder: backupConfigured() ? null : 'Backups are not configured. Set QRV_BACKUP_DIR or QRV_BACKUP_SCHEDULE before production launch.',
};

export const renderPricingPage = (_req, res) => res.status(200).send(renderMarketingView({
  ...model,
  pageTitle: 'QRV Pricing',
  heading: 'Launch-ready pricing for certificate verification SaaS',
  copy: 'Starter $99/mo, Growth $299/mo, Pro $999/mo. Start with trial mode and upgrade anytime from issuer dashboard.',
  ctaLabel: 'Create Issuer Account',
  ctaHref: '/api/v1/onboarding/signup',
}));

export const renderBookDemoPage = (_req, res) => res.status(200).send(renderMarketingView({
  ...model,
  pageTitle: 'Book Demo',
  heading: 'Book a founder-led QRV demo',
  copy: 'We walk through onboarding, issuing first certificate, and public verification workflow for your team.',
  ctaLabel: 'Email sales@qrv.network',
  ctaHref: 'mailto:sales@qrv.network',
}));

export const renderCertificateVerificationPage = (_req, res) => res.status(200).send(renderMarketingView({
  ...model,
  pageTitle: 'Certificate Verification',
  heading: 'Public certificate verification you can trust',
  copy: 'Third parties scan QRVID and receive deterministic VERIFIED/REVOKED/EXPIRED/NOT_FOUND status with proof reference.',
  ctaLabel: 'Try Verify',
  ctaHref: '/',
}));

export const renderMembershipVerificationPage = (_req, res) => res.status(200).send(renderMarketingView({
  ...model,
  pageTitle: 'Membership Verification',
  heading: 'Membership verification flows powered by QRV',
  copy: 'Use the same issuer onboarding and certificate infrastructure to validate active membership credentials.',
  ctaLabel: 'View Pricing',
  ctaHref: '/pricing',
}));
