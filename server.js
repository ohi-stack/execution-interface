const express = require('express');
const helmet = require('helmet');
const path = require('path');

const { verifyApiKey } = require('./src/runtime/keys');
const { rateLimit } = require('./src/runtime/rateLimit');
const { enforcePlanLimits } = require('./src/runtime/billingStub');
const { OMOSProcess } = require('./src/runtime/omos');
const { logEvent } = require('./src/runtime/logger');
const { tools } = require('./src/runtime/toolRegistry');
const appFederation = require('./public/federation/app.json');
const commerce = require('./src/config/commerce');
const calendarRoutes = require('./src/routes/calendar');
const schedulerRoutes = require('./src/routes/scheduler');

const app = express();
const usageMap = new Map();
const version = process.env.npm_package_version || '0.1.0';
const port = Number(process.env.PORT || 3001);

const PORT = Number(process.env.PORT || 3000);

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'"],
        "style-src": ["'self'", "'unsafe-inline'"],
        "img-src": ["'self'", 'data:', 'https:'],
        "font-src": ["'self'", 'https:', 'data:'],
        "connect-src": ["'self'", 'https://app.onegodian.com', 'https://onegodian.org', 'https://onegodian.com'],
        "object-src": ["'none'"],
        "base-uri": ["'self'"],
        "frame-ancestors": ["'none'"],
        "upgrade-insecure-requests": []
      }
    },
    crossOriginEmbedderPolicy: false
  })
);

app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/calendar', calendarRoutes);
app.use('/api/scheduler', schedulerRoutes);

const usageMap = new Map();
function trackUsage(apiKeyName) {
  const count = usageMap.get(apiKeyName) || 0;
  usageMap.set(apiKeyName, count + 1);
}

function requireApiKey(req, res, next) {
  const apiKey = req.headers['x-omos-key'] || req.headers.authorization?.replace('Bearer ', '');
  const keyMeta = verifyApiKey(apiKey);

  if (!keyMeta) {
    return res.status(401).json({ error: 'unauthorized', message: 'Valid OMOS API key required' });
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
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'omos-runtime', timestamp: new Date().toISOString() });
});

app.get('/manifest', (_req, res) => {
  logEvent('manifest.requested', { route: '/manifest' });
  res.json(require('./public/manifest/omos.manifest.json'));
});

app.get('/dashboard', (_req, res) => {
  logEvent('dashboard.requested', { route: '/dashboard' });

  res.json({
    runtime: 'express',
    mode: process.env.NODE_ENV || 'development',
    status: 'active',
    uptimeSeconds: Math.floor(process.uptime()),
    manifestVersion: require('./public/manifest/omos.manifest.json').version,
    routeCount: app._router?.stack?.filter((layer) => layer.route).length || 0,
    processRequests: Array.from(usageMap.values()).reduce((sum, count) => sum + count, 0),
    connectedSystems: [
      'https://app.onegodian.com',
      'https://onegodian.org',
      'https://onegodian.com',
      'https://quantumohi.com'
    ],
    tools
  });
});

app.get('/', (_req, res) => res.sendFile(path.join(__dirname, 'src/pages/index.html')));
app.get('/docs', (_req, res) => res.sendFile(path.join(__dirname, 'src/pages/docs.html')));
app.get('/tools', (_req, res) => res.sendFile(path.join(__dirname, 'src/pages/tools.html')));
app.get('/tools/bridge-builder', (_req, res) => res.sendFile(path.join(__dirname, 'src/pages/tools/bridge-builder.html')));
app.get('/tools/belief-mapper', (_req, res) => res.sendFile(path.join(__dirname, 'src/pages/tools/belief-mapper.html')));
app.get('/artifacts', (_req, res) => res.sendFile(path.join(__dirname, 'src/pages/artifacts.html')));
app.get('/shop', (_req, res) => res.sendFile(path.join(__dirname, 'src/pages/shop.html')));
app.get('/contact', (_req, res) => res.sendFile(path.join(__dirname, 'src/pages/contact.html')));
app.get('/legal', (_req, res) => res.sendFile(path.join(__dirname, 'src/pages/legal.html')));

app.get('/federation/app', (_req, res) => res.json(appFederation));

module.exports = { app, usageMap, trackUsage, requireApiKey, requireAdmin };
app.get('/shop/downloads', (_req, res) => res.json(commerce.downloads));
app.get('/shop/memberships', (_req, res) => res.json(commerce.memberships));
app.get('/shop/certificates', (_req, res) => res.json(commerce.certificates));
app.get('/shop/contribute', (_req, res) => res.json(commerce.contribute));

app.post('/process', requireApiKey, rateLimit({ limit: 100, windowMs: 60000 }), (req, res) => {
  logEvent('process.requested', { route: '/process' });

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

  const result = OMOSProcess(input);
  trackUsage(req.apiKeyMeta.name);

  return res.json({ status: 'ok', plan, limits, data: result });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`OMOS runtime listening on http://localhost:${PORT}`);
  });
}

module.exports = { app, usageMap, trackUsage, requireApiKey };
