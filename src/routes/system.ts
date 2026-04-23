import { Router } from "express";
import { env } from "../config/env.js";

export const systemRouter = Router();

systemRouter.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: {
      name: env.appName,
      version: env.appVersion,
      environment: env.nodeEnv
    },
    timestamp: new Date().toISOString()
  });
});

systemRouter.get("/health", (_req, res) => {
  res.json({
    ok: true,
    timestamp: new Date().toISOString()
  });
});

systemRouter.get("/v1/status", (_req, res) => {
  res.json({
    ok: true,
    version: env.appVersion,
    environment: env.nodeEnv,
    timestamp: new Date().toISOString()
  });
});

systemRouter.get("/v1/definition", (_req, res) => {
  res.json({
    ok: true,
    definition: {
      name: "ONEGODIAN",
      organization: "ONEGODIAN, LLC",
      type: "commercial private enterprise",
      description: "Backend API hub for Onegodian products and operational services"
    }
  });
});
