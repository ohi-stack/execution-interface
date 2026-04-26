import { Router } from 'express';

const workflowsRouter = Router();

workflowsRouter.post('/run', (req, res) => {
  res.status(501).json({
    ok: false,
    message: 'Workflow execution pipeline is not implemented yet.',
    received: req.body ?? null
  });
});

export default workflowsRouter;
