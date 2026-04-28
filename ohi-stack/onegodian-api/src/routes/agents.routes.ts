import { NextFunction, Request, Response, Router } from 'express';
import { z } from 'zod';

const agentsRouter = Router();

const executeSchema = z.object({
  task: z.string().min(1, 'task is required')
});

agentsRouter.post('/execute', (req: Request, res: Response, next: NextFunction) => {
  const parsed = executeSchema.safeParse(req.body);

  if (!parsed.success) {
    const error = new Error('Request validation failed') as Error & { code?: string; details?: unknown; status?: number };
    error.code = 'validation_error';
    error.status = 400;
    error.details = parsed.error.flatten();
    next(error);
    return;
  }

  res.status(501).json({
    ok: false,
    message: 'Agent execution pipeline is not implemented yet.',
    received: parsed.data
  });
});

export default agentsRouter;
