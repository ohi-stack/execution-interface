import { Router } from 'express';

const agentsRouter = Router();

agentsRouter.post('/execute', (req, res) => {
  res.status(501).json({
    ok: false,
    message: 'Agent execution pipeline is not implemented yet.',
    received: req.body ?? null
  });
});

export default agentsRouter;
