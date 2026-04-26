import { Router } from 'express';

const twinRouter = Router();

twinRouter.post('/execute', (req, res) => {
  res.status(501).json({
    ok: false,
    message: 'OHI Twin execution pipeline is not implemented yet.',
    received: req.body ?? null
  });
});

export default twinRouter;
