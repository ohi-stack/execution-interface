export const platformStatuses = ['Live', 'In Development', 'Planned', 'Under Review', 'Discontinued'] as const;
export type PlatformStatus = (typeof platformStatuses)[number];

export type PlatformCapability = {
  id: string;
  name: string;
  status: PlatformStatus;
  description: string;
};

export const platformCapabilities = [
  { id: 'contract', name: 'Ethereum token contract', status: 'Live', description: 'The canonical ERC-20 contract is deployed on Ethereum Mainnet.' },
  { id: 'portal', name: 'Public information portal', status: 'Live', description: 'Canonical token facts, disclosures, and documentation are publicly available.' },
  { id: 'application', name: 'ODC platform application', status: 'In Development', description: 'Application services are being implemented and validated.' },
  { id: 'wordpress', name: 'WordPress bridge', status: 'In Development', description: 'A controlled, read-only integration path is being developed.' },
  { id: 'wallet', name: 'Wallet linking', status: 'In Development', description: 'Non-custodial address linking exists in code but is not offered as a live public service.' },
  { id: 'payments', name: 'Payments', status: 'Under Review', description: 'Payment capabilities are being evaluated and are not available.' },
  { id: 'rewards', name: 'Rewards', status: 'Planned', description: 'Participation programs are planned; eligibility and timing are not guaranteed.' },
  { id: 'defi', name: 'Swapping, staking, and governance', status: 'Under Review', description: 'No swapping, staking, or governance service is currently offered.' },
] satisfies readonly PlatformCapability[];

export const utilityCategories = [
  { name: 'Digital products', status: 'In Development', description: 'Potential utility for approved digital goods.' },
  { name: 'Platform subscriptions', status: 'In Development', description: 'Subscription access models are being designed.' },
  { name: 'Membership services', status: 'In Development', description: 'Commercial membership uses remain in development.' },
  { name: 'Education and courses', status: 'Planned', description: 'Future approved learning experiences.' },
  { name: 'Gaming applications', status: 'Planned', description: 'Potential integrations with approved games.' },
  { name: 'Creator and merchant tools', status: 'Planned', description: 'Tools for approved ecosystem participants.' },
  { name: 'Rewards and participation', status: 'Planned', description: 'Potential participation programs with terms to be defined.' },
  { name: 'Approved integrations', status: 'Under Review', description: 'Integrations require technical and commercial review.' },
] satisfies readonly Omit<PlatformCapability, 'id'>[];
