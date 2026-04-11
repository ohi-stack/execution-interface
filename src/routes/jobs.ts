import { Router } from "express";
import { getJob } from "../services/jobService";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/:id", requireAuth, (req, res) => {
  const job = getJob(req.params.id);

  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }

  return res.json(job);
});

export default router;
