import { getHealthStatus, getServiceIndex } from '../services/healthService.js';

export const serviceIndex = (_req, res) => {
  res.status(200).json({ data: getServiceIndex() });
};

export const healthCheck = async (_req, res, next) => {
  try {
    const status = await getHealthStatus();
    res.status(200).json({ data: status });
  } catch (error) {
    next(error);
  }
};
