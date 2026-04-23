import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import { executeRouter } from "./routes/execute.js";
import { systemRouter } from "./routes/system.js";

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || env.corsOrigins.length === 0 || env.corsOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Origin not allowed by CORS"));
  }
};

export const app = express();

app.disable("x-powered-by");

if (env.trustProxy) {
  app.set("trust proxy", true);
}

app.use(helmet());
app.use(morgan(env.isProduction ? "combined" : "dev"));
app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));

app.use(systemRouter);
app.use(executeRouter);

app.use(notFound);
app.use(errorHandler);
