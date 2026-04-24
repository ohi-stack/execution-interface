import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

const corsOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const isOriginAllowed = (origin?: string) => {
  if (!origin) {
    return true;
  }

  if (corsOrigins.length === 0) {
    return process.env.NODE_ENV !== "production";
  }

  return corsOrigins.includes(origin);
};

const corsOriginValidator = (
  origin: string | undefined,
  callback: (err: Error | null, allow?: boolean) => void
) => {
  if (isOriginAllowed(origin ?? undefined)) {
    return callback(null, true);
  }

  return callback(new Error("Not allowed by CORS"));
};

app.disable("x-powered-by");
app.set("trust proxy", true);

app.use(cors({ origin: corsOriginValidator }));
app.use(express.json({ limit: "1mb" }));

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

app.get("/v1/status", (_req, res) => {
  res.json({
    status: "ok",
    service: "onegodian-api",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "production",
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
  const expectedApiKey = process.env.EXECUTE_API_KEY;
  const providedApiKey = req.header("x-api-key");

  if (!expectedApiKey) {
    return res.status(503).json({
      success: false,
      error: "Execution endpoint unavailable: missing EXECUTE_API_KEY"
    });
  }

  if (!providedApiKey || providedApiKey !== expectedApiKey) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized"
    });
  }

  const { task, agent, metadata } = req.body || {};

  if (!task) {
    return res.status(400).json({
      success: false,
      error: "Missing required field: task"
    });
  }

  console.log("Execution request:", {
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
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error"
  });
});

const server = app.listen(PORT, () => {
  console.log(`OneGodian API running on port ${PORT}`);
});

const shutdown = (signal: string) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
