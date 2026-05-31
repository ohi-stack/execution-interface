const express = require('express');
const helmet = require('helmet');
const path = require('path');

const { verifyApiKey } = require('./src/runtime/keys');
const { rateLimit } = require('./src/runtime/rateLimit');
const { enforcePlanLimits } = require('./src/runtime/billingStub');
const { OMOSProcess } = require('./src/runtime/omos');
const { logEvent } = require('./src/runtime/logger');
const { tools } = require('./src/runtime/toolRegistry');
const {
  DEFAULT_JSON_LIMIT,
  requestIdMiddleware,
  corsMiddleware,
  noStoreApiMiddleware,
  validateProcessInput,
  readinessSnapshot,
  notFoundHandler,
  errorHandler,
  utcNow
} = require('./src/runtime/security');

const app = express();
const usageMap = new Map();

const VERSION = process.env.OMOS_VERSION || process.env.npm_package_version || '0.1.0';
const PORT = Number(process.env.PORT || 3000);
const ENVIRONMENT = process.env.NODE_ENV || 'development';
const CANONICAL_HOST = process.env.OMOS_CANONICAL_HOST || 'https://omos.onegodian.com';

const PUBLIC_ROUTES = [
  '/',
  '/ecosystem',
  '/overview',
  '/omos',
  '/algorithm',
  '/remember',
  '/time',
  '/commerce',
  '/identity',
  '/institutional',
  '/status'
];

const API_ROUTES = ['/health', '/api/health', '/ready', '/api/ready', '/version', '/api/version', '/api/system-health', '/manifest', '/api/manifest', '/api/stats', '/process'];

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(requestIdMiddleware);
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],
      "script-src": ["'self'", "'unsafe-inline'"],
      "style-src": ["'self'", "'unsafe-inline'"],
      "img-src": ["'self'", 'data:', 'https:'],
      "connect-src": ["'self'", 'https:'],
      "frame-ancestors": ["'none'"]
    }
  },
  hsts: ENVIRONMENT === 'production' ? { maxAge: 15552000, includeSubDomains: true } : false,
  referrerPolicy: { policy: 'no-referrer' }
}));
app.use(corsMiddleware);
app.use(noStoreApiMiddleware);
app.use(express.json({ limit: DEFAULT_JSON_LIMIT, strict: true }));
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets'), { immutable: true, maxAge: '1d' }));

function trackUsage(apiKeyName) {
  const count = usageMap.get(apiKeyName) || 0;
  usageMap.set(apiKeyName, count + 1);
}

function requireApiKey(req, res, next) {
  const authorization = req.headers.authorization;
  const bearer = typeof authorization === 'string' && authorization.startsWith('Bearer ') ? authorization.slice(7) : undefined;
  const apiKey = req.headers['x-omos-key'] || bearer;
  const keyMeta = verifyApiKey(Array.isArray(apiKey) ? apiKey[0] : apiKey);
  if (!keyMeta) {
    logEvent('auth.denied', { route: req.path, requestId: req.requestId });
    return res.status(401).json({ error: 'unauthorized', message: 'Valid OMOS API key required', requestId: req.requestId });
  }
  req.apiKeyMeta = keyMeta;
  return next();
}

const healthPayload = () => ({
  status: 'ok',
  service: 'omos-runtime',
  version: VERSION,
  environment: ENVIRONMENT,
  timestampUtc: utcNow()
});

app.get('/health', (_req, res) => res.json(healthPayload()));
app.get('/api/health', (_req, res) => res.json(healthPayload()));
app.get('/version', (_req, res) => res.json({ service: 'omos-runtime', version: VERSION, environment: ENVIRONMENT, timestampUtc: utcNow() }));
app.get('/api/version', (_req, res) => res.json({ service: 'omos-runtime', version: VERSION, environment: ENVIRONMENT, timestampUtc: utcNow() }));
app.get('/ready', (_req, res) => {
  const snapshot = readinessSnapshot({ version: VERSION, environment: ENVIRONMENT, usageMap });
  res.status(snapshot.status === 'ready' ? 200 : 503).json(snapshot);
});
app.get('/api/ready', (_req, res) => {
  const snapshot = readinessSnapshot({ version: VERSION, environment: ENVIRONMENT, usageMap });
  res.status(snapshot.status === 'ready' ? 200 : 503).json(snapshot);
});
app.get('/api/system-health', (_req, res) => res.json(readinessSnapshot({ version: VERSION, environment: ENVIRONMENT, usageMap })));

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

app.get('/api/stats', requireApiKey, (_req, res) => {
  res.json({
    service: 'omos-runtime',
    version: VERSION,
    environment: ENVIRONMENT,
    uptimeSeconds: Math.floor(process.uptime()),
    processRequests: Array.from(usageMap.values()).reduce((sum, count) => sum + count, 0),
    timestampUtc: utcNow()
  });
});

app.post('/process', requireApiKey, rateLimit({ limit: 100, windowMs: 60000 }), (req, res) => {
  const validation = validateProcessInput(req.body);
  if (!validation.ok) {
    return res.status(validation.status).json({ error: validation.error, message: validation.message, requestId: req.requestId });
  }
  const input = validation.value;
  const plan = req.apiKeyMeta.plan;
  const limits = enforcePlanLimits(plan);
  if (limits.rpm < 100) {
    return res.status(429).json({ error: 'plan_limit_exceeded', message: `Plan (${plan}) allows ${limits.rpm} requests per minute` });
  }
  const data = OMOSProcess(input);
  trackUsage(req.apiKeyMeta.name);
  logEvent('process.completed', { apiKeyName: req.apiKeyMeta.name, plan, requestId: req.requestId });
  return res.json({ status: 'ok', plan, limits, data, requestId: req.requestId });
});

for (const route of PUBLIC_ROUTES) {
  if (route === '/dashboard') continue;
  app.get(route, (_req, res) => res.sendFile(path.join(__dirname, `src/pages${route === '/' ? '/index' : route}.html`)));
}

app.use(notFoundHandler);
app.use(errorHandler);

if (require.main === module) {
  const server = app.listen(PORT, () => console.log(`OMOS runtime listening on http://localhost:${PORT}`));

  const shutdown = (signal) => {
    logEvent('runtime.shutdown', { signal });
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

module.exports = { app, usageMap, trackUsage, requireApiKey, PUBLIC_ROUTES, API_ROUTES };
