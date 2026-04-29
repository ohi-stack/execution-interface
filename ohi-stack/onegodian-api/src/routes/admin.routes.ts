import { Router } from 'express';

import { persistence } from '../lib/persistence';

const router = Router();

router.get('/stats', async (_req, res, next) => {
  try {
    const stats = await persistence.getAdminStats();
    res.status(200).json({
      ok: true,
      stats: {
        ...stats,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
