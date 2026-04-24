import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";

const app = express();
const startedAt = new Date();

app.disable("x-powered-by");
app.set("trust proxy", true);

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use((req, _res, next) => {
  logger.info("Incoming request", {
    method: req.method,
    path: req.path,
    requestId: req.headers["x-request-id"] ?? null
  });
  next();
});

app.get("/", (_req, res) => {
  res.json({
    service: "onegodian-api",
    status: "running",
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "onegodian-api",
    timestamp: new Date().toISOString()
  });
});

app.get("/health/live", (_req, res) => {
  res.json({
    ok: true,
    status: "live",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

app.get("/health/ready", (_req, res) => {
  res.json({
    ok: true,
    status: "ready",
    environment: env.NODE_ENV,
    startedAt: startedAt.toISOString(),
    timestamp: new Date().toISOString()
  });
});

app.get("/v1/status", (_req, res) => {
  res.json({
    status: "ok",
    service: "onegodian-api",
    version: "1.0.0",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

app.get("/v1/definition", (_req, res) => {
  res.json({
    name: "ONEGODIAN",
    classification: "founder-defined identity framework",
    description: "Core API definition endpoint for the OneGodian system"
  });
});

app.post("/execute", (req, res) => {
  const { task, agent, metadata } = req.body || {};

  if (!task) {
    return res.status(400).json({
      success: false,
      error: "Missing required field: task"
    });
  }

  logger.info("Execution request", {
    task,
    agent,
    metadata,
    timestamp: new Date().toISOString()
  });

  return res.json({
    success: true,
    message: "Execution received",
    input: { task, agent },
    timestamp: new Date().toISOString()
  });
});

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: "Not found"
  });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error("Unhandled error", { message: err.message, stack: err.stack });
  res.status(500).json({
    success: false,
    error: "Internal server error"
  });
});

const server = app.listen(env.PORT, () => {
  logger.info("OneGodian API started", { port: env.PORT, nodeEnv: env.NODE_ENV });
});

const shutdown = (signal: string) => {
  logger.warn("Received shutdown signal", { signal });
  server.close(() => {
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
