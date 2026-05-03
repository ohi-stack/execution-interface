export type EcosystemCategory = 'infrastructure' | 'identity' | 'commerce' | 'governance' | 'education' | 'media' | 'registry';
export type ProductionStatus = 'Live' | 'Staging' | 'In Development' | 'Needs Setup' | 'Offline' | 'Planned';
export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
export type IconKey = 'gateway' | 'identity' | 'registry' | 'commerce' | 'education' | 'media' | 'shield' | 'planet' | 'database' | 'workflow';

export type EcosystemSystem = {
  id: string;
  slug: string;
  name: string;
  category: EcosystemCategory;
  iconKey: IconKey;
  productionStatus: ProductionStatus;
  priority: Priority;
  domain: string;
  repo: string;
  deploymentTarget: string;
  publicUrl?: string;
  adminUrl?: string;
  apiHealthUrl?: string;
  lastCheckedLabel: string;
  description: string;
  productionChecklist: string[];
  nextActions: string[];
};

export const ECOSYSTEM_CATEGORIES: EcosystemCategory[] = [
  'infrastructure',
  'identity',
  'commerce',
  'governance',
  'education',
  'media',
  'registry'
];

export const PRODUCTION_STATUSES: ProductionStatus[] = ['Live', 'Staging', 'In Development', 'Needs Setup', 'Offline', 'Planned'];
export const PRIORITIES: Priority[] = ['Critical', 'High', 'Medium', 'Low'];

export const ONEGODIAN_ECOSYSTEM: EcosystemSystem[] = [
  {
    id: 'OG-SYS-001',
    slug: 'onegodian-app',
    name: 'OneGodian App',
    category: 'infrastructure',
    iconKey: 'gateway',
    productionStatus: 'Live',
    priority: 'Critical',
    domain: 'app.onegodian.com',
    repo: 'ohi-stack/execution-interface',
    deploymentTarget: 'Hostinger / Next.js production app',
    publicUrl: 'https://app.onegodian.com',
    adminUrl: 'https://app.onegodian.com/dashboard',
    apiHealthUrl: 'https://app.onegodian.com/ecosystem',
    lastCheckedLabel: 'Node App Live · Hostinger Deployment Active',
    description: 'Primary visual command interface for OneGodian systems, navigation, modules, dashboards, and operational surfaces.',
    productionChecklist: ['Dashboard routes live', 'Ecosystem registry visible', 'Mobile layout verified', 'Production build passing'],
    nextActions: ['Connect live status checks', 'Add authenticated admin controls', 'Sync system metadata from API Gateway']
  },
  {
    id: 'OG-SYS-002',
    slug: 'api-gateway',
    name: 'OneGodian API Gateway',
    category: 'infrastructure',
    iconKey: 'workflow',
    productionStatus: 'Needs Setup',
    priority: 'Critical',
    domain: 'api.onegodian.org',
    repo: 'ohi-stack/onegodian-api',
    deploymentTarget: 'Hostinger Node.js app',
    publicUrl: 'https://api.onegodian.org',
    apiHealthUrl: 'https://api.onegodian.org/health',
    lastCheckedLabel: 'Pending first production deployment',
    description: 'Official OneGodian API Gateway for identity recognition, member sync, agent execution, and Stripe webhook intake.',
    productionChecklist: ['Root package.json present', 'Hostinger server.js startup file', 'Health endpoint', 'Private endpoint API-secret middleware', 'Stripe webhook route'],
    nextActions: ['Deploy Node app on Hostinger', 'Set production environment variables', 'Run /health and /api/status smoke tests']
  },
  {
    id: 'OG-SYS-003',
    slug: 'onegodian-org',
    name: 'OneGodian.org',
    category: 'identity',
    iconKey: 'identity',
    productionStatus: 'Live',
    priority: 'Critical',
    domain: 'onegodian.org',
    repo: 'ohi-stack/onegodian-org',
    deploymentTarget: 'WordPress public identity and education site',
    publicUrl: 'https://onegodian.org',
    adminUrl: 'https://onegodian.org/wp-admin',
    lastCheckedLabel: 'Public site live; content updates ongoing',
    description: 'Public institutional, identity, belief, education, and platform layer for the OneGodian framework.',
    productionChecklist: ['Public homepage', 'Identity content', 'Education sections', 'App navigation link'],
    nextActions: ['Add API Gateway integration points', 'Publish system command dashboard links', 'Tighten page-to-app calls to action']
  },
  {
    id: 'OG-SYS-004',
    slug: 'university-onegodian',
    name: 'University of OneGodian',
    category: 'education',
    iconKey: 'education',
    productionStatus: 'In Development',
    priority: 'High',
    domain: 'u.onegodian.org',
    repo: 'ohi-stack/onegodian-org',
    deploymentTarget: 'WordPress/LMS education layer',
    publicUrl: 'https://u.onegodian.org',
    adminUrl: 'https://u.onegodian.org/wp-admin',
    lastCheckedLabel: 'Education content buildout in progress',
    description: 'Education, courses, lessons, certification pathways, and structured learning for the OneGodian framework.',
    productionChecklist: ['Homepage draft', 'Course categories', 'Enrollment path', 'Student dashboard'],
    nextActions: ['Define LMS plugin source of truth', 'Connect entitlements to API Gateway', 'Publish first learning path']
  },
  {
    id: 'OG-SYS-005',
    slug: 'odin-registry',
    name: 'ODIN Registry Core',
    category: 'registry',
    iconKey: 'registry',
    productionStatus: 'In Development',
    priority: 'High',
    domain: 'registry.onegodian.org',
    repo: 'ohi-stack/qrv-registry',
    deploymentTarget: 'Registry service and verification records',
    publicUrl: 'https://registry.onegodian.org',
    apiHealthUrl: 'https://registry.onegodian.org/health',
    lastCheckedLabel: 'Registry architecture active; production sync pending',
    description: 'Canonical registration, indexing, validation, and lookup surface for OneGodian records and identifiers.',
    productionChecklist: ['Registry model', 'Record lookup', 'Verification route', 'Admin issue flow'],
    nextActions: ['Define record schema', 'Connect QR-V verification', 'Add authenticated write workflow']
  },
  {
    id: 'OG-SYS-006',
    slug: 'qrv-verification',
    name: 'QR-V™ Verification',
    category: 'governance',
    iconKey: 'shield',
    productionStatus: 'Staging',
    priority: 'High',
    domain: 'qrv.onegodian.org',
    repo: 'ohi-stack/qrv-api',
    deploymentTarget: 'Verification API and public verification portal',
    publicUrl: 'https://qrv.onegodian.org',
    apiHealthUrl: 'https://qrv.onegodian.org/health',
    lastCheckedLabel: 'Staging verification surface exists; production hardening pending',
    description: 'Verification layer for certificates, memberships, records, and proof objects across the OneGodian ecosystem.',
    productionChecklist: ['Public verify page', 'API status route', 'Record validation', 'Failure state UI'],
    nextActions: ['Connect live registry records', 'Add signed proof object support', 'Publish verification documentation']
  },
  {
    id: 'OG-SYS-007',
    slug: 'onegodian-commerce',
    name: 'OneGodian Commerce',
    category: 'commerce',
    iconKey: 'commerce',
    productionStatus: 'Planned',
    priority: 'Medium',
    domain: 'onegodian.com',
    repo: 'ohi-stack/onegodian-org',
    deploymentTarget: 'WooCommerce commercial site',
    publicUrl: 'https://onegodian.com',
    adminUrl: 'https://onegodian.com/wp-admin',
    lastCheckedLabel: 'Commercial build planned',
    description: 'Commercial store for books, downloads, merchandise, membership products, and digital asset offerings.',
    productionChecklist: ['Store homepage', 'Product categories', 'Checkout', 'Stripe setup', 'Delivery emails'],
    nextActions: ['Create product import files', 'Define membership products', 'Connect purchase entitlements to API']
  },
  {
    id: 'OG-SYS-008',
    slug: 'media-center',
    name: 'OneGodian Media Center',
    category: 'media',
    iconKey: 'media',
    productionStatus: 'Planned',
    priority: 'Low',
    domain: 'media.onegodian.org',
    repo: 'ohi-stack/onegodian-org',
    deploymentTarget: 'WordPress media archive and press center',
    publicUrl: 'https://media.onegodian.org',
    lastCheckedLabel: 'Pending media archive launch',
    description: 'Media archive for banners, brand assets, videos, publications, screenshots, and press-ready materials.',
    productionChecklist: ['Media taxonomy', 'Download archive', 'Press page', 'Brand kit'],
    nextActions: ['Organize visual assets', 'Create public media categories', 'Add press and founder resources']
  },
  {
    id: 'OG-SYS-009',
    slug: 'planetary-registry',
    name: 'Planetary Registry',
    category: 'registry',
    iconKey: 'planet',
    productionStatus: 'Live',
    priority: 'Medium',
    domain: 'app.onegodian.com/planetary-registry',
    repo: 'ohi-stack/execution-interface',
    deploymentTarget: 'Next.js app module',
    publicUrl: 'https://app.onegodian.com/planetary-registry',
    lastCheckedLabel: 'App module route available',
    description: 'Visual registry module for worlds, civilizations, governance mappings, and planetary narrative systems.',
    productionChecklist: ['Route available', 'Dashboard card linked', 'Visual module styling', 'Static dataset'],
    nextActions: ['Add searchable records', 'Add registry detail pages', 'Connect to ODIN registry data']
  },
  {
    id: 'OG-SYS-010',
    slug: 'agent-command-console',
    name: 'Agent Command Console',
    category: 'infrastructure',
    iconKey: 'database',
    productionStatus: 'In Development',
    priority: 'Critical',
    domain: 'acc.onegodian.org',
    repo: 'ohi-stack/acc',
    deploymentTarget: 'Control plane for agents, workflows, logs, and runtime operations',
    publicUrl: 'https://acc.onegodian.org',
    apiHealthUrl: 'https://acc.onegodian.org/health',
    lastCheckedLabel: 'ACC architecture in active buildout',
    description: 'Control plane for OneGodian agents, workflows, integrations, task execution, logs, and operational state.',
    productionChecklist: ['Dashboard shell', 'Agent registry', 'Workflow queue', 'Log viewer', 'API Gateway connection'],
    nextActions: ['Define agent schema', 'Connect API Gateway', 'Add authenticated command execution']
  }
];

export const getEcosystemSystemBySlug = (slug: string) => ONEGODIAN_ECOSYSTEM.find((system) => system.slug === slug);

export const ecosystemSummary = {
  totalSystems: ONEGODIAN_ECOSYSTEM.length,
  liveSystems: ONEGODIAN_ECOSYSTEM.filter((system) => system.productionStatus === 'Live').length,
  criticalSystems: ONEGODIAN_ECOSYSTEM.filter((system) => system.priority === 'Critical').length,
  needsSetup: ONEGODIAN_ECOSYSTEM.filter((system) => system.productionStatus === 'Needs Setup').length
};
