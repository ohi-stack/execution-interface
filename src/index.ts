import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);
const NODE_ENV = process.env.NODE_ENV || "development";
const LOG_LEVEL = process.env.LOG_LEVEL || "info";
const APP_VERSION = process.env.npm_package_version || "1.0.0";

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS origin is not allowed"));
  }
};

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startedAt = Date.now();

  res.on("finish", () => {
    if (LOG_LEVEL === "silent") {
      return;
    }

    const durationMs = Date.now() - startedAt;
    console.log(
      `${new Date().toISOString()} ${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms`
    );
  });

  next();
};

app.disable("x-powered-by");
app.set("trust proxy", true);

app.use(helmet());
app.use(cors(corsOptions));
app.use(requestLogger);
app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => {
  res.status(200).json({
    service: "onegodian-api",
    status: "running",
    version: APP_VERSION,
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    service: "onegodian-api",
    version: APP_VERSION,
    timestamp: new Date().toISOString()
  });
});

app.get("/ready", (_req, res) => {
  res.status(200).json({
    ready: true,
    service: "onegodian-api",
    version: APP_VERSION,
    timestamp: new Date().toISOString()
  });
});

app.get("/v1/status", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "onegodian-api",
    version: APP_VERSION,
    environment: NODE_ENV,
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

app.post("/execute", (req, res) => {
  const payload = req.body as { task?: unknown; agent?: unknown; metadata?: unknown };

  if (!payload || typeof payload !== "object") {
    return res.status(400).json({
      success: false,
      error: {
        code: "INVALID_BODY",
        message: "Request body must be a JSON object"
      }
    });
  }

  if (typeof payload.task !== "string" || payload.task.trim() === "") {
    return res.status(400).json({
      success: false,
      error: {
        code: "MISSING_TASK",
        message: "Field 'task' is required and must be a non-empty string"
      }
    });
  }

  return res.status(200).json({
    success: true,
    message: "Execution received",
    data: {
      task: payload.task,
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
        message: "Malformed JSON in request body"
      }
    });
  }

  if (err.message === "CORS origin is not allowed") {
    return res.status(403).json({
      success: false,
      error: {
        code: "CORS_DENIED",
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

const server = app.listen(PORT, () => {
  console.log(`onegodian-api listening on port ${PORT}`);
});

const shutdown = (signal: string) => {
  console.log(`Received ${signal}. Starting graceful shutdown...`);

  server.close((err) => {
    if (err) {
      console.error("Error during server shutdown:", err);
      process.exit(1);
    }

    console.log("HTTP server closed.");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Forced shutdown after timeout.");
    process.exit(1);
  }, 10_000).unref();
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
