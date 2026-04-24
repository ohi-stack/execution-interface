import { getMetrics } from '../services/metricsService.js';

export const metricsHandler = async (_req, res) => {
  const metrics = await getMetrics();
  return res.status(200).json({
    ...metrics,
    timestamp: new Date().toISOString(),
  });
};
