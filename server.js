const express = require('express');

const { verifyApiKey } = require('./src/runtime/keys');
const { rateLimit } = require('./src/runtime/rateLimit');
const { enforcePlanLimits } = require('./src/runtime/billingStub');

const app = express();
app.use(express.json());

const usageMap = new Map();

function trackUsage(apiKeyName) {
  const count = usageMap.get(apiKeyName) || 0;
  usageMap.set(apiKeyName, count + 1);
}

function OMOSProcess(input) {
  const raw = input?.content?.raw || '';

  return {
    observed: { length: raw.length },
    distilled: { summary: raw.slice(0, 280) },
    aligned: {},
    result: { text: `Processed: ${raw}` },
    verification: { timestamp: new Date().toISOString() }
  };
}

function requireApiKey(req, res, next) {
  const apiKey = req.headers['x-omos-key'] || req.headers['authorization']?.replace('Bearer ', '');

  const keyMeta = verifyApiKey(apiKey);

  if (!keyMeta) {
    return res.status(401).json({
      error: 'unauthorized',
      message: 'Valid OMOS API key required'
    });
  }

  req.apiKeyMeta = keyMeta;
  next();
}

app.post('/process', requireApiKey, rateLimit({ limit: 100, windowMs: 60000 }), (req, res) => {
  try {
    const input = req.body;

    if (!input || !input.content?.raw) {
      return res.status(400).json({
        error: 'invalid_input',
        message: 'content.raw is required'
      });
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

    return res.json({
      status: 'ok',
      plan,
      limits,
      data: result
    });
  } catch (err) {
    return res.status(500).json({
      error: 'processing_error',
      message: err.message
    });
  }
});

const port = Number(process.env.PORT || 3001);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`OMOS API server listening on ${port}`);
  });
}

module.exports = { app, usageMap, trackUsage, requireApiKey, OMOSProcess };
const express = require("express");
const fs = require("fs");
const path = require("path");
const { OMOSProcess } = require("./src/runtime/omos");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/assets", express.static(path.join(__dirname, "public", "assets")));
app.use(express.static(path.join(__dirname, "public")));

const version = process.env.npm_package_version || "0.1.0";

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "omos-runtime", timestamp: new Date().toISOString() });
});

app.get("/ready", (_req, res) => {
  res.json({ status: "ready", checks: { process: "up", memory: "ok" } });
});

app.get("/version", (_req, res) => {
  res.json({ version, name: "omos-runtime" });
});

app.post("/process", (req, res) => {
  const pipeline = OMOSProcess(req.body || {});
  res.json({ status: "ok", pipeline });
});

const staticPages = {
  "/": "home.html",
  "/what-is-omos": "what-is-omos.html",
  "/onegodian-algorithm": "onegodian-algorithm.html",
  "/developer-docs": "developer-docs.html",
  "/contact": "contact.html",
  "/omos-1-0-protocol-specification": "omos-1-0-protocol-specification.html",
};

Object.entries(staticPages).forEach(([route, fileName]) => {
  app.get(route, (_req, res, next) => {
    const pagePath = path.join(__dirname, "src", "pages", fileName);
    if (!fs.existsSync(pagePath)) return next();
    return res.sendFile(pagePath);
  });
});

app.listen(PORT, () => {
  console.log(`OMOS runtime listening on http://localhost:${PORT}`);
});
