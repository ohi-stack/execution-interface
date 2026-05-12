export type CertificateRecord = {
  recordId: string;
  instrumentReference: string;
  holderReference: string;
  recordStatus: string;
  issuanceStatus: string;
  verificationMetadata: string;
};

export type ReadinessItem = {
  layer: string;
  status: string;
  detail: string;
};

export const certificates: CertificateRecord[] = [
  {
    recordId: 'CERT-2026-001',
    instrumentReference: 'INFRA-CAP-ALPHA',
    holderReference: 'HOLDER-INT-001',
    recordStatus: 'Disclosure review pending',
    issuanceStatus: 'Internal acceptance pending',
    verificationMetadata: 'Checksum logged · QRV pre-link queued'
  },
  {
    recordId: 'CERT-2026-002',
    instrumentReference: 'INFRA-CAP-BETA',
    holderReference: 'HOLDER-INT-002',
    recordStatus: 'Acknowledgement workflow active',
    issuanceStatus: 'Record prepared',
    verificationMetadata: 'Document hash captured · Audit review open'
  }
];

export const readinessItems: ReadinessItem[] = [
  { layer: 'Branding', status: '~80%', detail: 'Identity language and visual baseline mostly aligned.' },
  { layer: 'Layout', status: '~70%', detail: 'Core page composition is present with ongoing responsive tuning.' },
  { layer: 'Routing', status: '~60%', detail: 'Primary routes are available with ongoing path consolidation.' },
  { layer: 'Production Data', status: '~10%', detail: 'Live database bindings are mostly pending.' },
  { layer: 'Investor Systems', status: '~5%', detail: 'Investor record persistence and session flows remain early.' },
  { layer: 'Admin Systems', status: '~5%', detail: 'Administrative workflows are scaffolded and pending expansion.' },
  { layer: 'Verification Layer', status: '~15%', detail: 'Verification metadata structure exists with bridge work pending.' },
  { layer: 'Compliance Workflow', status: '~10%', detail: 'Disclosure and acknowledgement persistence is in planning stage.' }
];
