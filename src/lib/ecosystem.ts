export const ECOSYSTEM_CATEGORIES = [
  'Identity',
  'ODIN Registry',
  'Galaxy',
  'Certificates',
  'Commerce',
  'Learning',
  'Media',
  'Members',
  'Tools',
  'Infrastructure',
  'External Ventures'
] as const;

export const SYNC_TYPES = ['Link Sync', 'Content Sync', 'User Sync', 'Payment Sync', 'Verification Sync'] as const;

export type EcosystemCategory = (typeof ECOSYSTEM_CATEGORIES)[number];
export type SyncType = (typeof SYNC_TYPES)[number];

export type EcosystemStatus = 'active' | 'building' | 'planned';
export type SyncPriority = 'high' | 'medium' | 'low';

export type EcosystemSystem = {
  id: string;
  name: string;
  domain: string;
  category: EcosystemCategory;
  status: EcosystemStatus;
  description: string;
  syncPriority: SyncPriority;
  syncTypes: SyncType[];
  primaryActionLabel: string;
  primaryActionHref: string;
};

export const ONEGODIAN_ECOSYSTEM_SYSTEMS: EcosystemSystem[] = [
  {
    id: 'onegodian-org',
    name: 'OneGodian.org',
    domain: 'https://onegodian.org',
    category: 'Identity',
    status: 'active',
    description: 'Primary mission and identity layer for the OneGodian ecosystem.',
    syncPriority: 'high',
    syncTypes: ['Link Sync', 'Content Sync', 'Verification Sync'],
    primaryActionLabel: 'Open Site',
    primaryActionHref: 'https://onegodian.org'
  },
  {
    id: 'quantumohi',
    name: 'QuantumOHI',
    domain: 'https://quantumohi.com',
    category: 'Infrastructure',
    status: 'building',
    description: 'Operational infrastructure and bridge layer that supports orchestration across systems.',
    syncPriority: 'high',
    syncTypes: ['Link Sync', 'Content Sync', 'User Sync'],
    primaryActionLabel: 'View Infrastructure',
    primaryActionHref: 'https://quantumohi.com'
  },
  {
    id: 'odin-registry',
    name: 'ODIN Registry',
    domain: 'https://app.onegodian.com/registry',
    category: 'ODIN Registry',
    status: 'active',
    description: 'Canonical index of ODIN records, statuses, and protocol-addressable entities.',
    syncPriority: 'high',
    syncTypes: ['Link Sync', 'Verification Sync'],
    primaryActionLabel: 'Open Registry',
    primaryActionHref: '/registry'
  },
  {
    id: 'onegodian-galaxy',
    name: 'OneGodian Galaxy',
    domain: 'https://app.onegodian.com/moons-systems',
    category: 'Galaxy',
    status: 'active',
    description: 'Planetary and moon system exploration directory for the OneGodian network.',
    syncPriority: 'medium',
    syncTypes: ['Link Sync', 'Content Sync'],
    primaryActionLabel: 'Explore Galaxy',
    primaryActionHref: '/moons-systems'
  },
  {
    id: 'obp1-certificates',
    name: 'OBP-1 Certificates',
    domain: 'https://app.onegodian.com/certificates',
    category: 'Certificates',
    status: 'building',
    description: 'Certificate issuance, validation, and evidence lifecycle under OBP-1 standards.',
    syncPriority: 'high',
    syncTypes: ['Verification Sync', 'Content Sync'],
    primaryActionLabel: 'Review Certificates',
    primaryActionHref: '/certificates'
  },
  {
    id: 'onegodian-members',
    name: 'OneGodian Members',
    domain: 'https://members.onegodian.com',
    category: 'Members',
    status: 'planned',
    description: 'Member identity, onboarding, and access governance workspace.',
    syncPriority: 'high',
    syncTypes: ['User Sync', 'Verification Sync', 'Link Sync'],
    primaryActionLabel: 'View Members',
    primaryActionHref: 'https://members.onegodian.com'
  },
  {
    id: 'digital-products',
    name: 'Digital Products',
    domain: 'https://app.onegodian.com/products',
    category: 'Commerce',
    status: 'building',
    description: 'Digital offerings catalog and fulfillment pathways for ecosystem commerce.',
    syncPriority: 'medium',
    syncTypes: ['Content Sync', 'Payment Sync', 'Link Sync'],
    primaryActionLabel: 'Browse Products',
    primaryActionHref: '/products'
  },
  {
    id: 'subjecttodeals',
    name: 'SubjectToDeals',
    domain: 'https://subjecttodeals.com',
    category: 'External Ventures',
    status: 'planned',
    description: 'External venture connected to OneGodian commerce and partnership pipelines.',
    syncPriority: 'medium',
    syncTypes: ['Link Sync', 'Payment Sync'],
    primaryActionLabel: 'Open Venture',
    primaryActionHref: 'https://subjecttodeals.com'
  },
  {
    id: 'homeera-beginagain',
    name: 'HomeEra / BeginAgain',
    domain: 'https://homeera.com',
    category: 'External Ventures',
    status: 'planned',
    description: 'Housing-oriented venture stream aligned for future ecosystem referral and content syncing.',
    syncPriority: 'low',
    syncTypes: ['Link Sync', 'Content Sync'],
    primaryActionLabel: 'Open Venture',
    primaryActionHref: 'https://homeera.com'
  }
];
