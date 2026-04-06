import { executeWorkflow, getExecution } from '../../services/executionService.js';

export const postExecute = (req, res) => {
  const workflow = req.body?.workflow;
  const result = executeWorkflow({ req, workflow });
  return res.status(result.statusCode).json(result.envelope);
};

export const getExecutionById = (req, res) => {
  const result = getExecution({ executionId: req.params.id });
  return res.status(result.statusCode).json(result.envelope);
};
