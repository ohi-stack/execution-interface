import express from "express";
import morgan from "morgan";
import { errorHandler } from "./middleware/errorHandler";
import healthRoutes from "./routes/health";
import jobsRoutes from "./routes/jobs";
import menuRoutes from "./routes/menu";
import verifyRoutes from "./routes/verify";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(morgan("dev"));

  app.use("/health", healthRoutes);
  app.use("/jobs", jobsRoutes);
  app.use("/verify", verifyRoutes);
  app.use("/menu", menuRoutes);

  app.use(errorHandler);

  return app;
}
