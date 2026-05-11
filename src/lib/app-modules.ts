export type ProductionStatus = 'Live' | 'Demo Ready' | 'Staging' | 'In Development' | 'Needs Setup' | 'Planned' | 'Offline' | 'Blocked';
export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
export type ModuleVisibility = 'public' | 'internal' | 'private';

export type AppModule = {
  title: string;
  shortTitle: string;
  slug: string;
  route: string;
  category: string;
  productionStatus: ProductionStatus;
  priority: Priority;
  visibility: ModuleVisibility;
  iconKey: string;
  odinCode: string;
  domain: string;
  repo: string;
  deploymentTarget: string;
  version: string;
  connectedSystemIds: string[];
  features: string[];
  checklist: string[];
  nextActions: string[];
  metrics: Array<{
    label: string;
    value: string;
    trend?: 'up' | 'down' | 'flat';
  }>;
};

const BASE_REPO = 'ohi-stack/execution-interface';

export const appModules: AppModule[] = [
  {
    title: 'Dashboard', shortTitle: 'Dashboard', slug: 'dashboard', route: '/dashboard', category: 'Command', productionStatus: 'Live', priority: 'Critical', visibility: 'public', iconKey: 'layout-dashboard', odinCode: 'ODN-CMD-001', domain: 'command.onegodian.com', repo: BASE_REPO, deploymentTarget: 'Vercel Production', version: 'v1.2.0', connectedSystemIds: ['ecosystem', 'registry', 'tools', 'time'], features: ['Global status', 'Quick actions', 'System alerts'], checklist: ['Route online', 'Widgets configured', 'Telemetry active'], nextActions: ['Add role-based tiles', 'Enable command macros'], metrics: [{ label: 'Uptime', value: '99.98%', trend: 'flat' }, { label: 'Daily Commands', value: '12.4k', trend: 'up' }]
  },
  {
    title: 'Ecosystem', shortTitle: 'Eco', slug: 'ecosystem', route: '/ecosystem', category: 'Systems', productionStatus: 'Live', priority: 'Critical', visibility: 'public', iconKey: 'network', odinCode: 'ODN-SYS-002', domain: 'ecosystem.onegodian.com', repo: BASE_REPO, deploymentTarget: 'Vercel Production', version: 'v1.1.0', connectedSystemIds: ['dashboard', 'registry', 'galaxy'], features: ['System map', 'Status index', 'Dependency graph'], checklist: ['Live route', 'Sync jobs', 'Data snapshots'], nextActions: ['Add topology diff view'], metrics: [{ label: 'Tracked Systems', value: '15', trend: 'up' }]
  },
  {
    title: 'Registry', shortTitle: 'Registry', slug: 'registry', route: '/registry', category: 'Governance', productionStatus: 'In Development', priority: 'High', visibility: 'public', iconKey: 'database', odinCode: 'ODN-GOV-003', domain: 'registry.onegodian.com', repo: BASE_REPO, deploymentTarget: 'Vercel Preview', version: 'v0.8.0', connectedSystemIds: ['ecosystem', 'certificates', 'profile'], features: ['Record ledger', 'Validation states'], checklist: ['Schema finalized', 'Audit trail pending'], nextActions: ['Ship mutation API', 'Connect cert issuance'], metrics: [{ label: 'Validated Records', value: '426', trend: 'up' }]
  },
  { title: 'Games', shortTitle: 'Games', slug: 'games', route: '/games', category: 'Experience', productionStatus: 'Staging', priority: 'Medium', visibility: 'public', iconKey: 'gamepad-2', odinCode: 'ODN-XP-004', domain: 'games.onegodian.com', repo: BASE_REPO, deploymentTarget: 'Vercel Preview', version: 'v0.9.2', connectedSystemIds: ['media', 'profile'], features: ['Game hub', 'Session launcher'], checklist: ['Catalog ready', 'Leaderboards pending'], nextActions: ['Launch seasonal events'], metrics: [{ label: 'Playable Titles', value: '8', trend: 'up' }] },
  { title: 'Planets', shortTitle: 'Planets', slug: 'planets', route: '/galaxy/planets', category: 'Cosmos', productionStatus: 'Live', priority: 'Medium', visibility: 'public', iconKey: 'planet', odinCode: 'ODN-COS-005', domain: 'galaxy.onegodian.com', repo: BASE_REPO, deploymentTarget: 'Vercel Production', version: 'v1.0.3', connectedSystemIds: ['galaxy', 'moons-systems', 'life-intelligence'], features: ['Planet index', 'Canon profiles'], checklist: ['Data complete', 'Maps linked'], nextActions: ['Add climate overlays'], metrics: [{ label: 'Catalogued Planets', value: '42', trend: 'flat' }] },
  { title: 'Galaxy', shortTitle: 'Galaxy', slug: 'galaxy', route: '/galaxy', category: 'Cosmos', productionStatus: 'Live', priority: 'High', visibility: 'public', iconKey: 'stars', odinCode: 'ODN-COS-006', domain: 'galaxy.onegodian.com', repo: BASE_REPO, deploymentTarget: 'Vercel Production', version: 'v1.1.1', connectedSystemIds: ['planets', 'moons-systems', 'ecosystem'], features: ['Galaxy map', 'System routes'], checklist: ['Navigation live', 'Scene optimized'], nextActions: ['Enable deep-link markers'], metrics: [{ label: 'Rendered Systems', value: '128', trend: 'up' }] },
  { title: 'Life & Intelligence', shortTitle: 'Life', slug: 'life-intelligence', route: '/galaxy/life-intelligence', category: 'Cosmos', productionStatus: 'In Development', priority: 'High', visibility: 'public', iconKey: 'brain', odinCode: 'ODN-COS-007', domain: 'galaxy.onegodian.com', repo: BASE_REPO, deploymentTarget: 'Vercel Preview', version: 'v0.6.0', connectedSystemIds: ['planets', 'moons-systems'], features: ['Species records', 'Civilization tiers'], checklist: ['Taxonomy defined', 'UI pending'], nextActions: ['Connect research dataset'], metrics: [{ label: 'Intelligence Classes', value: '12', trend: 'up' }] },
  { title: 'Moons & Systems', shortTitle: 'Moons', slug: 'moons-systems', route: '/galaxy/moons-systems', category: 'Cosmos', productionStatus: 'Demo Ready', priority: 'Medium', visibility: 'public', iconKey: 'orbit', odinCode: 'ODN-COS-008', domain: 'galaxy.onegodian.com', repo: BASE_REPO, deploymentTarget: 'Vercel Preview', version: 'v0.9.0', connectedSystemIds: ['planets', 'galaxy'], features: ['Orbit registry', 'System grouping'], checklist: ['Demo flow works', 'Export pending'], nextActions: ['Add relation graph'], metrics: [{ label: 'Tracked Moons', value: '316', trend: 'up' }] },
  { title: 'Tools', shortTitle: 'Tools', slug: 'tools', route: '/tools', category: 'Utilities', productionStatus: 'In Development', priority: 'High', visibility: 'public', iconKey: 'wrench', odinCode: 'ODN-UTL-009', domain: 'tools.onegodian.com', repo: BASE_REPO, deploymentTarget: 'Vercel Preview', version: 'v0.7.5', connectedSystemIds: ['dashboard', 'time', 'capital'], features: ['Tool launcher', 'Utility cards'], checklist: ['Core set ready', 'Permissions pending'], nextActions: ['Add execution history'], metrics: [{ label: 'Active Tools', value: '27', trend: 'up' }] },
  { title: 'Time', shortTitle: 'Time', slug: 'time', route: '/time', category: 'Utilities', productionStatus: 'Live', priority: 'Medium', visibility: 'public', iconKey: 'clock-3', odinCode: 'ODN-UTL-010', domain: 'time.onegodian.com', repo: BASE_REPO, deploymentTarget: 'Vercel Production', version: 'v1.0.0', connectedSystemIds: ['dashboard', 'tools'], features: ['Chronology tools', 'Timeline sync'], checklist: ['Core widgets live'], nextActions: ['Add timezone operator views'], metrics: [{ label: 'Time Sync Accuracy', value: '99.9%', trend: 'flat' }] },
  { title: 'Capital', shortTitle: 'Capital', slug: 'capital', route: '/capital', category: 'Economic', productionStatus: 'Staging', priority: 'High', visibility: 'internal', iconKey: 'landmark', odinCode: 'ODN-ECO-011', domain: 'capital.onegodian.com', repo: BASE_REPO, deploymentTarget: 'Vercel Preview', version: 'v0.8.4', connectedSystemIds: ['products', 'dashboard'], features: ['Capital dashboards', 'Funding insights'], checklist: ['Data sources linked', 'Compliance review'], nextActions: ['Integrate forecasting model'], metrics: [{ label: 'Tracked Assets', value: '$48.2M', trend: 'up' }] },
  { title: 'Products', shortTitle: 'Products', slug: 'products', route: '/products', category: 'Economic', productionStatus: 'Demo Ready', priority: 'Medium', visibility: 'public', iconKey: 'package', odinCode: 'ODN-ECO-012', domain: 'products.onegodian.com', repo: BASE_REPO, deploymentTarget: 'Vercel Preview', version: 'v0.9.1', connectedSystemIds: ['capital', 'media'], features: ['Product catalog', 'Launch statuses'], checklist: ['Catalog seeded', 'Pricing sync pending'], nextActions: ['Enable purchase analytics'], metrics: [{ label: 'Published Products', value: '34', trend: 'up' }] },
  { title: 'Certificates', shortTitle: 'Certs', slug: 'certificates', route: '/certificates', category: 'Governance', productionStatus: 'In Development', priority: 'High', visibility: 'internal', iconKey: 'badge-check', odinCode: 'ODN-GOV-013', domain: 'registry.onegodian.com', repo: BASE_REPO, deploymentTarget: 'Vercel Preview', version: 'v0.5.0', connectedSystemIds: ['registry', 'profile'], features: ['Issuance queue', 'Verification tools'], checklist: ['Templates created', 'Signing key pending'], nextActions: ['Implement verification endpoint'], metrics: [{ label: 'Issued Certificates', value: '119', trend: 'up' }] },
  { title: 'Media', shortTitle: 'Media', slug: 'media', route: '/media', category: 'Experience', productionStatus: 'Live', priority: 'Medium', visibility: 'public', iconKey: 'image', odinCode: 'ODN-XP-014', domain: 'media.onegodian.com', repo: BASE_REPO, deploymentTarget: 'Vercel Production', version: 'v1.0.8', connectedSystemIds: ['games', 'products', 'profile'], features: ['Media library', 'Asset governance'], checklist: ['Delivery CDN live', 'Tag hygiene ongoing'], nextActions: ['Add smart collections'], metrics: [{ label: 'Managed Assets', value: '9,412', trend: 'up' }] },
  { title: 'Profile', shortTitle: 'Profile', slug: 'profile', route: '/profile', category: 'Identity', productionStatus: 'Staging', priority: 'High', visibility: 'private', iconKey: 'user-circle-2', odinCode: 'ODN-ID-015', domain: 'id.onegodian.com', repo: BASE_REPO, deploymentTarget: 'Vercel Preview', version: 'v0.9.7', connectedSystemIds: ['certificates', 'registry', 'media'], features: ['Identity card', 'Access map'], checklist: ['Auth hardening', 'Recovery flows'], nextActions: ['Enable linked identities'], metrics: [{ label: 'Active Profiles', value: '2,781', trend: 'up' }] }
];

export function getAppModuleBySlug(slug: string) {
  return appModules.find((moduleItem) => moduleItem.slug === slug);
}

export function getAppModulesByCategory(category: string) {
  return appModules.filter((moduleItem) => moduleItem.category === category);
}

export function getConnectedModules(slug: string) {
  const moduleItem = getAppModuleBySlug(slug);
  if (!moduleItem) return [];
  return moduleItem.connectedSystemIds
    .map((id) => getAppModuleBySlug(id))
    .filter((connectedModule): connectedModule is AppModule => Boolean(connectedModule));
}

export const liveSystems = appModules.filter((moduleItem) => moduleItem.productionStatus === 'Live');

export const criticalSystems = appModules.filter((moduleItem) => moduleItem.priority === 'Critical');
