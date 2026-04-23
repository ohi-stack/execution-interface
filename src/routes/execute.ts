import { Router } from "express";

export const executeRouter = Router();

type ExecuteBody = {
  task?: unknown;
  agent?: unknown;
  metadata?: unknown;
};

executeRouter.post("/execute", (req, res) => {
  const body: ExecuteBody = req.body && typeof req.body === "object" ? req.body : {};
  const task = typeof body.task === "string" ? body.task.trim() : "";

  if (!task) {
    return res.status(400).json({
      ok: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Missing required field: task"
      }
    });
  }

  const agent = typeof body.agent === "string" ? body.agent.trim() : undefined;

  return res.json({
    ok: true,
    data: {
      accepted: true,
      task,
      ...(agent ? { agent } : {}),
      hasMetadata: typeof body.metadata !== "undefined"
    },
    timestamp: new Date().toISOString()
  });
});
