import { createExecutionEnvelope } from '../../services/executionService.js';

export const postExecute = (req, res) => {
  const result = createExecutionEnvelope(req.body);
  return res.status(result.statusCode).json(result.response);
};
