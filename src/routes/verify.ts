import { Router } from "express";
import { z } from "zod";
import { enqueueVerify } from "../services/verifyService";
import { requireAuth } from "../middleware/auth";

const router = Router();

const verifySchema = z.object({
  subject: z.string().min(1),
  type: z.string().min(1),
  metadata: z.record(z.any()).optional()
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const payload = verifySchema.parse(req.body);
    const job = await enqueueVerify(payload);
    return res.status(202).json(job);
  } catch (error) {
    return next(error);
  }
});

export default router;
