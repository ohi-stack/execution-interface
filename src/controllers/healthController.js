import { getHealthStatus } from '../services/healthService.js';

export const healthCheck = async (_req, res, next) => {
  try {
    const status = await getHealthStatus();
    res.status(200).json(status);
  } catch (error) {
    next(error);
  }
};
