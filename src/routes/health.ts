import { Router } from "express";

const router = Router();

router.get("/", (_req: any, res: any) => {
  res.json({
    status: "ok",
    service: "instryx.qrv.network",
    timestamp: new Date().toISOString()
  });
});

export default router;
