export const ODC = {
  name: 'OneGodian Digital Coin', symbol: 'ODC', network: 'Ethereum Mainnet', chainId: 1,
  standard: 'ERC-20', contract: '0x9eee1e3615efe0374a7588d2760db5ffb2d5ce98',
  maximumSupply: '777000000000', decimals: 18, organization: 'ONEGODIAN, LLC',
  canonicalUrl: 'https://odc.onegodian.com', version: '1.0.0'
} as const;

export const featureStatuses = ['Production', 'In Development', 'Private Beta', 'Under Review', 'Planned', 'Deprecated'] as const;
export type FeatureStatus = typeof featureStatuses[number];

export const features = [
  { name: 'Canonical token record', status: 'Production' },
  { name: 'Public API', status: 'Production' },
  { name: 'WordPress bridge', status: 'Production' },
  { name: 'Wallet custody', status: 'Planned' },
  { name: 'Token purchases', status: 'Under Review' },
  { name: 'Swaps', status: 'Under Review' },
  { name: 'Staking', status: 'Planned' },
  { name: 'Governance voting', status: 'Planned' },
  { name: 'Marketplace settlement', status: 'In Development' },
  { name: 'Rewards', status: 'Under Review' },
  { name: 'Treasury execution', status: 'Planned' }
] satisfies { name: string; status: FeatureStatus }[];

export function apiPayload<T>(data: T, status = 'ok') {
  return { version: ODC.version, timestamp: new Date().toISOString(), status, data };
}

export const cacheHeaders = { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' };
