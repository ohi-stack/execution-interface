export const healthHandler = (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'execution-interface',
  });
};

export const versionHandler = (_req, res) => {
  res.status(200).json({
    service: 'execution-interface',
    version: 'v1',
  });
};
