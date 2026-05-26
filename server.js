const express = require('express');
const helmet = require('helmet');
const path = require('path');

const { verifyApiKey } = require('./src/runtime/keys');
const { rateLimit } = require('./src/runtime/rateLimit');
const { enforcePlanLimits } = require('./src/runtime/billingStub');
const { OMOSProcess } = require('./src/runtime/omos');
const { logEvent } = require('./src/runtime/logger');
const { tools } = require('./src/runtime/toolRegistry');

const app = express();
const usageMap = new Map();

const VERSION = process.env.OMOS_VERSION || process.env.npm_package_version || '0.1.0';
const PORT = Number(process.env.PORT || 3000);
const ENVIRONMENT = process.env.NODE_ENV || 'development';
const CANONICAL_HOST = process.env.OMOS_CANONICAL_HOST || 'https://omos.onegodian.com';

const PUBLIC_ROUTES = [
  '/',
  '/omos',
  '/ohi',
  '/models',
  '/tools',
  '/artifacts',
  '/docs',
  '/shop',
  '/latest-news',
  '/dashboard',
  '/legal',
  '/contact',
  '/protocol',
  '/algorithm',
  '/digital-sanctuary'
];

const API_ROUTES = ['/health', '/api/health', '/manifest', '/api/manifest', '/process'];

app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));

function trackUsage(apiKeyName) {
  const count = usageMap.get(apiKeyName) || 0;
  usageMap.set(apiKeyName, count + 1);
}

function requireApiKey(req, res, next) {
  const apiKey = req.headers['x-omos-key'] || req.headers.authorization?.replace('Bearer ', '');
  const keyMeta = verifyApiKey(apiKey);
  if (!keyMeta) return res.status(401).json({ error: 'unauthorized', message: 'Valid OMOS API key required' });
  req.apiKeyMeta = keyMeta;
  return next();
}

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'omos-runtime', version: VERSION }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'omos-runtime', version: VERSION }));

const manifestPayload = () => ({
  serviceId: 'omos-runtime',
  name: 'OMOS™ — OneGodian Metaphysical Operating System™',
  fullName: 'OneGodian Metaphysical Operating System™',
  status: 'active',
  classification: 'Node runtime, protocol documentation, and agent-facing integration site',
  version: VERSION,
  environment: ENVIRONMENT,
  canonicalHost: CANONICAL_HOST,
  publicRoutes: PUBLIC_ROUTES,
  apiRoutes: API_ROUTES,
  wordpressPluginBridge: {
    plugin: 'onegodian-forms-bridge',
    frontendRoutes: ['/contact', '/development-inquiry', '/business-inquiry', '/community-inquiry', '/membership-inquiry', '/contributor-intake'],
    adminScreens: ['Forms', 'Submissions', 'Email Settings', 'Google Sync', 'Spam Protection', 'Export / Logs']
  },
  compatibleHosts: ['https://onegodian.com', 'https://onegodian.org', 'https://quantumohi.com'],
  appBridge: ['https://app.onegodian.com'],
  commerceBridge: ['https://onegodian.com'],
  tools
});

app.get('/manifest', (_req, res) => {
  logEvent('manifest.requested', { route: '/manifest' });
  res.json(manifestPayload());
});
app.get('/api/manifest', (_req, res) => res.json(manifestPayload()));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/dashboard', (_req, res) => {
  res.json({
    runtime: 'express',
    mode: ENVIRONMENT,
    status: 'active',
    uptimeSeconds: Math.floor(process.uptime()),
    processRequests: Array.from(usageMap.values()).reduce((sum, count) => sum + count, 0)
  });
});

app.post('/process', requireApiKey, rateLimit({ limit: 100, windowMs: 60000 }), (req, res) => {
  const input = req.body;
  if (!input || !input.content?.raw) return res.status(400).json({ error: 'invalid_input', message: 'content.raw is required' });
  const plan = req.apiKeyMeta.plan;
  const limits = enforcePlanLimits(plan);
  if (limits.rpm < 100) {
    return res.status(429).json({ error: 'plan_limit_exceeded', message: `Plan (${plan}) allows ${limits.rpm} requests per minute` });
  }
  const data = OMOSProcess(input);
  trackUsage(req.apiKeyMeta.name);
  return res.json({ status: 'ok', plan, limits, data });
});

for (const route of PUBLIC_ROUTES) {
  if (route === '/dashboard') continue;
  app.get(route, (_req, res) => res.sendFile(path.join(__dirname, `src/pages${route === '/' ? '/index' : route}.html`)));
}

if (require.main === module) {
  app.listen(PORT, () => console.log(`OMOS runtime listening on http://localhost:${PORT}`));
}

module.exports = { app, usageMap, trackUsage, requireApiKey, PUBLIC_ROUTES, API_ROUTES };
