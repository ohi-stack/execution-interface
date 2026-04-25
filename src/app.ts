import cors from "cors";
import express from "express";

export const app = express();

const corsOrigins = (process.env.CORS_ORIGIN ?? process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable("x-powered-by");
app.set("trust proxy", true);

app.use(
  cors({
    origin(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
      if (!origin || corsOrigins.length === 0 || corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
  })
);

app.use(express.json({ limit: "1mb" }));

const healthPayload = Object.freeze({
  ok: true,
  status: "ok",
  service: "onegodian-api",
});

app.get("/health", (_req, res) => {
  res.status(200).json(healthPayload);
});

app.get("/healthz", (_req, res) => {
  res.status(200).json(healthPayload);
});

app.get("/readyz", (_req, res) => {
  res.status(200).json({
    ...healthPayload,
    ready: true,
  });
});

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "onegodian-api running",
  });
});

app.use((_req, res) => {
  res.status(404).json({
    ok: false,
    error: "Not found",
  });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    ok: false,
    error: "Internal server error",
  });
});
