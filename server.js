const express = require('express');
const path = require('path');

const { verifyApiKey } = require('./src/runtime/keys');
const { rateLimit } = require('./src/runtime/rateLimit');
const { enforcePlanLimits } = require('./src/runtime/billingStub');
const { OMOSProcess } = require('./src/runtime/omos');
const calendarRoutes = require('./src/routes/calendar');
const schedulerRoutes = require('./src/routes/scheduler');

const app = express();
const usageMap = new Map();
const version = process.env.npm_package_version || '0.1.0';
const port = Number(process.env.PORT || 3001);

function trackUsage(apiKeyName) {
  const count = usageMap.get(apiKeyName) || 0;
  usageMap.set(apiKeyName, count + 1);
}

function requireApiKey(req, res, next) {
  const apiKey = req.headers['x-omos-key'] || req.headers.authorization?.replace('Bearer ', '');
  const keyMeta = verifyApiKey(apiKey);

  if (!keyMeta) {
    return res.status(401).json({
      error: 'unauthorized',
      message: 'Valid OMOS API key required'
    });
  }

  req.apiKeyMeta = keyMeta;
  return next();
}

function requireAdmin(req, res, next) {
  if (req.apiKeyMeta?.plan === 'enterprise') return next();
  return res.status(403).json({
    error: 'forbidden',
    message: 'Enterprise plan required for this endpoint'
  });
}

app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/calendar', calendarRoutes);
app.use('/api/v1/scheduler', schedulerRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/scheduler', schedulerRoutes);

app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok', service: 'omos-runtime', version, timestamp: new Date().toISOString() });
});

app.get('/api/v1/ready', (_req, res) => {
  const memory = process.memoryUsage();
  res.json({
    status: 'ready',
    checks: { process: 'up', memory: memory.heapUsed < memory.heapTotal ? 'ok' : 'pressure' },
    timestamp: new Date().toISOString()
  });
});

app.get('/api/v1/metrics', requireApiKey, requireAdmin, (_req, res) => {
  const usage = Array.from(usageMap.entries()).map(([keyName, count]) => ({ keyName, count }));
  res.json({
    status: 'ok',
    usage,
    process: {
      uptimeSeconds: Math.round(process.uptime()),
      rssBytes: process.memoryUsage().rss
    }
  });
});

app.post('/api/v1/process', requireApiKey, rateLimit({ limit: 100, windowMs: 60000 }), (req, res) => {
  const input = req.body;
  if (!input || !input.content?.raw) {
    return res.status(400).json({ error: 'invalid_input', message: 'content.raw is required' });
  }

  const plan = req.apiKeyMeta.plan;
  const limits = enforcePlanLimits(plan);
  if (limits.rpm < 100) {
    return res.status(429).json({
      error: 'plan_limit_exceeded',
      message: `Plan (${plan}) allows ${limits.rpm} requests per minute`
    });
  }

  const data = OMOSProcess(input);
  trackUsage(req.apiKeyMeta.name);
  return res.json({ status: 'ok', plan, limits, data });
});

// Compatibility aliases.
app.get('/health', (_req, res) => res.redirect(307, '/api/v1/health'));
app.get('/ready', (_req, res) => res.redirect(307, '/api/v1/ready'));
app.post('/process', requireApiKey, (req, res) => res.redirect(307, '/api/v1/process'));

if (require.main === module) {
  app.listen(port, () => {
    console.log(`OMOS API server listening on ${port}`);
  });
}

module.exports = { app, usageMap, trackUsage, requireApiKey, requireAdmin };
