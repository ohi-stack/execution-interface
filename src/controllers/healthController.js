export const healthHandler = (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'onegodian-public-site',
  });
};
