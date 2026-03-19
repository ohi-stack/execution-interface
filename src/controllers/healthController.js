export const healthHandler = (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'verify-portal',
  });
};
