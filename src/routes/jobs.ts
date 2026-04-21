import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { getJob } from "../services/jobService";

const router = Router();

router.get("/:id", requireAuth, (req: any, res: any) => {
  const job = getJob(req.params.id);

  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }

  return res.json(job);
});

export default router;
