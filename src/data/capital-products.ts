export const qrvNetwork = {
  api: 'api.zolfi.qrv.network',
  developerDocs: 'dev.zolfi.qrv.network',
  status: 'status.zolfi.qrv.network',
  verification: 'verify.qrv.network',
  registry: 'registry.qrv.network'
};

export const zolfiModules = [
  'Dashboard',
  'Security',
  'Contracts',
  'Audit',
  'Verification',
  'Research'
];

export const instryxModules = [
  'Requests',
  'Approvals',
  'Issuance',
  'Audit',
  'Exports',
  'Trace'
];

export const capitalRoutes = [
  '/zolfi',
  '/zolfi/security',
  '/zolfi/contracts',
  '/zolfi/verification',
  '/zolfi/research',
  '/instryx',
  '/instryx/requests',
  '/instryx/approvals',
  '/instryx/issuance',
  '/instryx/audit',
  '/instryx/trace',
  '/verify',
  '/registry'
];

export const capitalProducts = {
  zolfi: {
    name: 'Zolfi',
    publicUrl: 'capital.onegodian.com/zolfi',
    sourceReference: 'ohi-stack/zolfi-platform',
    description:
      'ONEGODIAN Capital’s blockchain security, smart contract intelligence, and post-quantum readiness product line.',
    cta: 'Open Zolfi security console',
    modules: zolfiModules,
    routes: ['/zolfi', '/zolfi/security', '/zolfi/contracts', '/zolfi/verification', '/zolfi/research']
  },
  instryx: {
    name: 'INSTRYX',
    publicUrl: 'capital.onegodian.com/instryx',
    sourceReference: 'ohi-stack/instryx-financial-interface',
    description:
      'ONEGODIAN Capital’s infrastructure intelligence, investment readiness, financial workflow, and execution analytics product line.',
    cta: 'Open INSTRYX workflow console',
    modules: instryxModules,
    routes: ['/instryx', '/instryx/requests', '/instryx/approvals', '/instryx/issuance', '/instryx/audit', '/instryx/trace']
  }
};

export const capitalDisclosure =
  'ONEGODIAN Capital pages are informational product and workflow interfaces. Disclosure, verification, registry, and proof references resolve through the QRV Network infrastructure layer and do not by themselves create an offer, guarantee, or securities transaction.';
