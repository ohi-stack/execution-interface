import dotenv from "dotenv";
import cors, { CorsOptions } from "cors";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);
const nodeEnv = process.env.NODE_ENV || "development";
const logLevel = process.env.LOG_LEVEL || "info";
const jsonBodyLimit = process.env.JSON_BODY_LIMIT || "1mb";
const appVersion = process.env.npm_package_version || "1.0.0";

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Origin not allowed by CORS policy"));
  }
};

if (logLevel !== "silent") {
  app.use(morgan(nodeEnv === "production" ? "combined" : "dev"));
}

app.disable("x-powered-by");
app.set("trust proxy", true);

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: jsonBodyLimit }));

app.get("/", (_req, res) => {
  res.status(200).json({
    service: "onegodian-api",
    status: "running",
    version: appVersion,
    environment: nodeEnv,
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    service: "onegodian-api",
    version: appVersion,
    timestamp: new Date().toISOString()
  });
});

app.get("/ready", (_req, res) => {
  res.status(200).json({
    ready: true,
    service: "onegodian-api",
    version: appVersion,
    timestamp: new Date().toISOString()
  });
});

app.get("/v1/status", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "onegodian-api",
    version: appVersion,
    environment: nodeEnv,
    timestamp: new Date().toISOString()
  });
});

app.get("/v1/definition", (_req, res) => {
  res.status(200).json({
    name: "ONEGODIAN",
    classification: "founder-defined identity framework",
    description: "Core API definition endpoint for the Onegodian system"
  });
});

type ExecuteRequestBody = {
  task?: unknown;
  agent?: unknown;
  metadata?: unknown;
};

app.post("/execute", (req: Request<unknown, unknown, ExecuteRequestBody>, res) => {
  const payload = req.body;

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return res.status(400).json({
      success: false,
      error: {
        code: "INVALID_REQUEST_BODY",
        message: "Request body must be a JSON object"
      }
    });
  }

  if (typeof payload.task !== "string" || payload.task.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: "TASK_REQUIRED",
        message: "Field 'task' is required and must be a non-empty string"
      }
    });
  }

  return res.status(200).json({
    success: true,
    message: "Execution received",
    data: {
      task: payload.task.trim(),
      agent: payload.agent ?? null,
      metadata: payload.metadata ?? null
    },
    timestamp: new Date().toISOString()
  });
});

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "Route not found"
    }
  });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      success: false,
      error: {
        code: "INVALID_JSON",
        message: "Malformed JSON request body"
      }
    });
  }

  if (err.message === "Origin not allowed by CORS policy") {
    return res.status(403).json({
      success: false,
      error: {
        code: "CORS_ORIGIN_DENIED",
        message: err.message
      }
    });
  }

  console.error("Unhandled error:", err);

  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error"
    }
  });
});

const server = app.listen(port, () => {
  console.log(`onegodian-api listening on port ${port}`);
});

const gracefulShutdown = (signal: string) => {
  console.log(`Received ${signal}; shutting down gracefully...`);

  server.close((closeError) => {
    if (closeError) {
      console.error("Failed to close server cleanly:", closeError);
      process.exit(1);
    }

    console.log("HTTP server closed.");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Graceful shutdown timed out; forcing exit.");
    process.exit(1);
  }, 10000).unref();
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
