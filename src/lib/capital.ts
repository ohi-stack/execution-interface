export type CapitalStatus = 'Active' | 'Development-stage' | 'Planned' | 'Compliance Review' | 'Paused' | 'Closed' | 'Needs API';

export type CapitalSummary = {
  estimatedStrategicValue: string;
  valuationLabel: string;
  threeYearRange: string;
  fiveYearRange: string;
  executionReadinessIndex: string;
  complianceReadiness: string;
  notesRaised: string;
  bondsRaised: string;
  ocaAllocation: string;
  activePrograms: number;
  stripeRevenue: string;
  wooCommerceRevenue: string;
  apiSubscriptionRevenue: string;
  licensingPipeline: string;
  certificateQueue: string;
};

export type CapitalInstrument = {
  name: string;
  registryCode?: string;
  raised?: string;
  target?: string;
  allocation?: string;
  status: CapitalStatus;
  summary: string;
};

export type CapitalValuation = {
  currentValue: string;
  threeYearRange: string;
  fiveYearProjection: string;
  assetAllocation: { label: string; percent: number }[];
  infrastructureProgress: { label: string; percent: number }[];
};

export type CapitalIntakePayload = {
  fullName: string;
  email: string;
  phone: string;
  interestType: 'notes' | 'bonds' | 'licensing' | 'api' | 'membership' | 'partnership';
  estimatedContributionAmount: string;
  accreditedInvestor: 'yes' | 'no' | 'unknown';
  riskAcknowledgment: boolean;
  notes?: string;
};

export type CapitalTransaction = { id: string; source: string; amount: string; status: string; date: string };
export type CapitalLicense = { name: string; description: string; monthlyPrice: string; apiLimit: string; status: CapitalStatus; cta: string };
export type CapitalApiStatus = { health: string; usageThisMonth: string; endpoints: string[]; webhookLogs: string; docs: { label: string; href: string }[] };

const API_BASE_URL = process.env.NEXT_PUBLIC_ONEGODIAN_API_URL ?? 'https://api.onegodian.org';

async function safeFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) }, cache: 'no-store' });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export const capitalComplianceDisclaimer =
  'Displayed values are internal strategic estimates and scenario-based projections. They are not audited valuations, investment advice, securities offerings, or guarantees of return. Any formal transaction must be governed by written agreements, applicable disclosures, and compliance review.';

export const defaultCapitalSummary: CapitalSummary = {
  estimatedStrategicValue: '$52M', valuationLabel: 'Internal Strategic Valuation Estimate', threeYearRange: '$135M–$205M', fiveYearRange: '$150M–$210M', executionReadinessIndex: '71.4%', complianceReadiness: '82.6%', notesRaised: '$235,000', bondsRaised: '$182,000', ocaAllocation: '$560,000 equivalent ecosystem value', activePrograms: 3, stripeRevenue: '$0 (Needs API)', wooCommerceRevenue: '$0 (Needs API)', apiSubscriptionRevenue: '$0 (Needs API)', licensingPipeline: '5 active conversations', certificateQueue: '17 pending'
};

export async function getCapitalSummary() { return (await safeFetch<CapitalSummary>('/api/capital/summary')) ?? defaultCapitalSummary; }
export async function getCapitalValuation() { return (await safeFetch<CapitalValuation>('/api/capital/valuation')) ?? { currentValue: '$52M', threeYearRange: '$135M–$205M', fiveYearProjection: '$150M–$210M', assetAllocation: [ { label: 'Core Intelligence Infrastructure', percent: 26 }, { label: 'Financial Systems', percent: 22 }, { label: 'Governance / Control Plane', percent: 14 }, { label: 'Verification / Identity', percent: 12 }, { label: 'Smart Infrastructure', percent: 10 }, { label: 'Land / Physical Development', percent: 7 }, { label: 'Culture / Education / Media', percent: 5 }, { label: 'Creative Tools', percent: 4 } ], infrastructureProgress: [ { label: 'Genesis Road™ Land Reclamation', percent: 64 }, { label: 'Turtleback Algonquian Forest™ Restoration', percent: 45 }, { label: 'OneGodian Smart City Prototype', percent: 28 }, { label: 'OHI Cloud™ Data Center Network', percent: 62 }, { label: 'OBCS™ & OHSID™ Rollout', percent: 54 }, { label: 'ACC™ Runtime Infrastructure', percent: 38 } ] }; }
export async function getCapitalInstruments() { return (await safeFetch<CapitalInstrument[]>('/api/capital/instruments')) ?? [ { name: 'OneGodian Notes™', registryCode: 'ODIN-F1000-NOTE', raised: '$235,000', target: '$1,500,000', status: 'Active', summary: 'Active early-stage capital formation.' }, { name: 'OneGodian Bonds™', registryCode: 'ODIN-F1000-BOND', raised: '$182,000', target: '$1,250,000', status: 'Development-stage', summary: 'Development-stage offering for contribution records.' }, { name: 'OCA™ Circulation Pool', registryCode: 'ODF-C01', allocation: '$560,000 equivalent ecosystem value', target: '$2,800,000 ecosystem target', status: 'Development-stage', summary: 'Internal expansion model.' }, { name: 'API Licensing Plans', status: 'Planned', summary: 'Planned API subscription layer.' }, { name: 'Enterprise Platform Licensing', status: 'Planned', summary: 'Planned platform license track.' } ]; }
export async function submitCapitalIntake(payload: CapitalIntakePayload) { const result = await safeFetch<{ ok: boolean }>('/api/capital/intake', { method: 'POST', body: JSON.stringify(payload) }); if (!result && process.env.NODE_ENV === 'development') console.log('Capital intake fallback payload', payload); return { ok: true }; }
export async function getCapitalPayments() { return (await safeFetch<CapitalTransaction[]>('/api/capital/payments')) ?? []; }
export async function getCapitalLicenses() { return (await safeFetch<CapitalLicense[]>('/api/capital/licensing')) ?? [ { name: 'Free Developer Preview', description: 'Sandbox access for development-stage API exploration.', monthlyPrice: '$0/mo', apiLimit: '10k requests/mo', status: 'Active', cta: 'Start Preview' }, { name: 'Builder API Plan', description: 'API subscription for early production apps.', monthlyPrice: '$99/mo', apiLimit: '250k requests/mo', status: 'Planned', cta: 'Request Access' }, { name: 'Pro API Plan', description: 'Higher-throughput API subscription with webhook support.', monthlyPrice: '$399/mo', apiLimit: '1M requests/mo', status: 'Planned', cta: 'Join Waitlist' }, { name: 'Enterprise License', description: 'Platform license for enterprise integration workflows.', monthlyPrice: 'Custom', apiLimit: 'Custom', status: 'Compliance Review', cta: 'Contact Team' }, { name: 'Institutional Integration', description: 'Institutional platform license and onboarding pathway.', monthlyPrice: 'Custom', apiLimit: 'Custom', status: 'Needs API', cta: 'Schedule Intake' } ]; }
export async function getCapitalApiStatus() { return (await safeFetch<CapitalApiStatus>('/api/capital/status')) ?? { health: 'Needs API', usageThisMonth: '0 requests (fallback)', endpoints: ['/api/capital/summary', '/api/capital/valuation', '/api/capital/instruments', '/api/capital/intake'], webhookLogs: 'No webhook logs connected.', docs: [{ label: 'OneGodian API Gateway', href: 'https://api.onegodian.org' }] }; }
