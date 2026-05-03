export type ProductionStatus =
  | 'Live'
  | 'Demo Ready'
  | 'Staging'
  | 'In Development'
  | 'Needs Setup'
  | 'Planned'
  | 'Offline';

export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

export type SystemCategory =
  | 'Command Hub'
  | 'System Directory'
  | 'ODIN Index'
  | 'Interactive Layer'
  | 'Planetary Canon'
  | 'Galactic Canon'
  | 'Life Intelligence'
  | 'Orbital Systems'
  | 'Utilities'
  | 'Commerce Layer'
  | 'Verification Layer'
  | 'Media Center'
  | 'User Layer'
  | 'Capital Layer'
  | 'Infrastructure';

export type Visibility = 'Public' | 'Member' | 'Admin' | 'Internal';

export type AppModule = {
  title: string;
  shortTitle?: string;
  slug: string;
  route: string;
  category: SystemCategory;
  description: string;
  productionStatus: ProductionStatus;
  priority: Priority;
  visibility: Visibility;
  iconKey: string;
  odinCode: string;
  domain?: string;
  repo?: string;
  deploymentTarget?: string;
  version?: string;
  lastCheckedLabel?: string;
  parentSystemId?: string;
  connectedSystemIds?: string[];
  apiHealthUrl?: string;
  adminUrl?: string;
  features: string[];
  checklist: string[];
  nextActions?: string[];
  metrics?: {
    records?: number;
    modules?: number;
    products?: number;
    certificates?: number;
    uptimeLabel?: string;
  };
};

const defaultSystemFields = {
  domain: 'app.onegodian.com',
  repo: 'ohi-stack/execution-interface',
  deploymentTarget: 'Hostinger Node App'
};

export const appModules: AppModule[] = [
  {
    ...defaultSystemFields,
    title: 'Command Dashboard',
    shortTitle: 'Dashboard',
    slug: 'dashboard',
    route: '/',
    category: 'Command Hub',
    productionStatus: 'Live',
    priority: 'Critical',
    visibility: 'Public',
    iconKey: 'layout-dashboard',
    odinCode: 'ODIN-APP-CMD-001',
    version: '0.2',
    lastCheckedLabel: 'Homepage systems model active',
    description: 'Central operating view for OneGodian platform modules, production status, priorities, registry totals, and system activity.',
    features: ['Module overview', 'Production status', 'Quick access', 'Mobile app shell', 'System cards', 'Registry routing'],
    checklist: ['Homepage live', 'Navigation active', 'Mobile layout active', 'Typed systems model active'],
    nextActions: ['Add global search', 'Add recent activity', 'Add live telemetry'],
    metrics: { modules: 14, uptimeLabel: 'Production shell live' }
  },
  {
    ...defaultSystemFields,
    title: 'Ecosystem Directory',
    shortTitle: 'Ecosystem',
    slug: 'ecosystem',
    route: '/ecosystem',
    category: 'System Directory',
    productionStatus: 'Live',
    priority: 'Critical',
    visibility: 'Public',
    iconKey: 'network',
    odinCode: 'ODIN-APP-ECO-001',
    version: '0.2',
    connectedSystemIds: ['dashboard', 'registry', 'tools'],
    description: 'Structured directory of OneGodian platforms, domains, repositories, infrastructure layers, deployment targets, and connected systems.',
    features: ['Domain directory', 'Repo mapping', 'Deployment checklist', 'System detail pages', 'Status filters', 'Priority filters'],
    checklist: ['Ecosystem page live', 'System cards active', 'Filters planned', 'Detail pages pending'],
    nextActions: ['Add dynamic system detail pages', 'Add health check URLs', 'Add platform relationship graph']
  },
  {
    ...defaultSystemFields,
    title: 'ODIN Registry',
    shortTitle: 'Registry',
    slug: 'registry',
    route: '/registry',
    category: 'ODIN Index',
    productionStatus: 'In Development',
    priority: 'Critical',
    visibility: 'Public',
    iconKey: 'database',
    odinCode: 'ODIN-REG-CORE-001',
    version: '0.1',
    connectedSystemIds: ['planets', 'certificates', 'products', 'life-intelligence'],
    description: 'Canonical registry layer for planets, systems, certificates, products, identity records, platform modules, and official OneGodian records.',
    features: ['ODIN categories', 'Search', 'Record cards', 'Verification handoff', 'Registry categories', 'Record detail model'],
    checklist: ['Registry shell active', 'Search pending', 'API sync pending', 'Persistence layer pending'],
    nextActions: ['Add searchable records', 'Add ODIN code display', 'Add record detail pages']
  },
  {
    ...defaultSystemFields,
    title: 'Games',
    slug: 'games',
    route: '/games',
    category: 'Interactive Layer',
    productionStatus: 'Demo Ready',
    priority: 'High',
    visibility: 'Public',
    iconKey: 'gamepad-2',
    odinCode: 'ODIN-GAME-CORE-001',
    description: 'Interactive games, prize-room demos, and educational play modules for the OneGodian App experience layer.',
    features: ['Bingo demo', 'Game library', 'History tab', 'Mobile gameplay', 'Player color identity', 'Prize-room styling'],
    checklist: ['Games route needed', 'Bingo route needed', 'Backend multiplayer pending']
  },
  {
    ...defaultSystemFields,
    title: 'Planetary Registry',
    shortTitle: 'Planets',
    slug: 'planets',
    route: '/planets',
    category: 'Planetary Canon',
    productionStatus: 'Live',
    priority: 'High',
    visibility: 'Public',
    iconKey: 'orbit',
    odinCode: 'ODIN-PR-CORE-001',
    version: '0.1',
    parentSystemId: 'registry',
    connectedSystemIds: ['galaxy', 'life-intelligence', 'moons-systems'],
    description: 'ODIN-PR registry for the 25-world OneGodian Galaxy™, including planetary roles, life systems, sentient alignments, intelligence types, and canonical world records.',
    features: ['Planet cards', 'Canon records', 'Realm summaries', 'Expansion map', '25-world registry', 'World continuity systems'],
    checklist: ['Planet route live', 'Planet data active', 'Detail pages pending', 'Galaxy map planned'],
    metrics: { records: 25 }
  },
  {
    ...defaultSystemFields,
    title: 'OneGodian Galaxy',
    shortTitle: 'Galaxy',
    slug: 'galaxy',
    route: '/galaxy',
    category: 'Galactic Canon',
    productionStatus: 'In Development',
    priority: 'High',
    visibility: 'Public',
    iconKey: 'sparkles',
    odinCode: 'ODIN-GALAXY-CORE-001',
    parentSystemId: 'registry',
    connectedSystemIds: ['planets', 'moons-systems', 'life-intelligence'],
    description: 'Parent canon hub for the OneGodian Galaxy™, planetary registry, moons, sentience systems, realms, lineages, figures, and temporal structures.',
    features: ['Galaxy parent hub', 'Planetary navigation', 'Canon summaries', 'Atlas interface', 'Temporal records', 'Satellite registry'],
    checklist: ['Galaxy hub active', 'Canon layout active', 'Interactive map pending'],
    nextActions: ['Add zoomable galaxy map', 'Connect planet detail pages', 'Add relationship graph']
  },
  {
    ...defaultSystemFields,
    title: 'Life & Intelligence Index',
    shortTitle: 'Life Intelligence',
    slug: 'life-intelligence',
    route: '/life-intelligence',
    category: 'Life Intelligence',
    productionStatus: 'Planned',
    priority: 'High',
    visibility: 'Public',
    iconKey: 'brain-circuit',
    odinCode: 'ODIN-LI-CORE-001',
    parentSystemId: 'planets',
    connectedSystemIds: ['planets', 'galaxy', 'media'],
    description: 'Sentience and intelligence classification layer for biological, harmonic, crystalline, temporal, atmospheric, reflective, aquatic, ancestral, and higher-order conscious systems.',
    features: ['Planetary life index', 'Species routes', 'Civilization records', 'Creature index', 'Intelligence classifications', 'Human compatibility index'],
    checklist: ['Create intelligence type model', 'Create planetary life table', 'Add species routes', 'Add intelligence visualizations'],
    metrics: { records: 25 }
  },
  {
    ...defaultSystemFields,
    title: 'Moons & Orbital Systems',
    shortTitle: 'Moons & Systems',
    slug: 'moons-systems',
    route: '/moons-systems',
    category: 'Orbital Systems',
    productionStatus: 'Live',
    priority: 'High',
    visibility: 'Public',
    iconKey: 'moon',
    odinCode: 'ODIN-ORB-CORE-001',
    parentSystemId: 'registry',
    connectedSystemIds: ['planets', 'galaxy', 'life-intelligence'],
    description: 'Orbital continuity layer for moons, satellite systems, planetary relationships, route structures, orbital records, and Elyndria™ continuity systems.',
    features: ['Moon registries', 'Orbital continuity', 'System hierarchies', 'Expansion structures', 'Celestial indexing', 'Elyndria™ archives'],
    checklist: ['Moon systems page live', 'Planet-to-moon relationships pending', 'Animated orbital map pending']
  },
  {
    ...defaultSystemFields,
    title: 'Tools & Utilities',
    shortTitle: 'Tools',
    slug: 'tools',
    route: '/tools',
    category: 'Utilities',
    productionStatus: 'In Development',
    priority: 'High',
    visibility: 'Public',
    iconKey: 'wrench',
    odinCode: 'ODIN-APP-TOOLS-001',
    connectedSystemIds: ['time', 'registry', 'certificates'],
    description: 'Operational utility layer for verification, converters, calculators, time tools, registry lookup, platform diagnostics, and future OHI-powered utilities.',
    features: ['Time converter', 'Verification lookup', 'Generators', 'System utilities', 'Registry lookup', 'API diagnostics'],
    checklist: ['Tools shell active', 'Time tool active', 'Verification API pending']
  },
  {
    ...defaultSystemFields,
    title: 'OneGodian Time System',
    shortTitle: 'Time',
    slug: 'time',
    route: '/time',
    category: 'Utilities',
    productionStatus: 'Live',
    priority: 'Critical',
    visibility: 'Public',
    iconKey: 'clock',
    odinCode: 'ODIN-TIME-OTS-V5',
    version: 'OTS-V5',
    connectedSystemIds: ['tools', 'registry'],
    description: 'OTS-V5 dual-date conversion and timestamp governance interface for Gregorian Time, OneGodian Time, UTC, public display, and database-safe temporal records.',
    features: ['Gregorian to OT conversion', 'Live dual-date clock', 'UTC timestamping', 'OTS-V5 compliance', 'Leap-year end-year rule'],
    checklist: ['Time route live', 'Conversion logic active', 'Timestamp examples active']
  },
  {
    ...defaultSystemFields,
    title: 'OneGodian Capital',
    shortTitle: 'Capital',
    slug: 'capital',
    route: '/capital',
    category: 'Capital Layer',
    productionStatus: 'In Development',
    priority: 'Critical',
    visibility: 'Public',
    iconKey: 'landmark',
    odinCode: 'ODIN-CAP-CORE-001',
    repo: 'ohi-stack/onegodian-capital-web',
    connectedSystemIds: ['products', 'certificates', 'registry'],
    description: 'Capital interface layer for contributor onboarding, financial product routing, verification handoff, Stripe readiness, and future capital dashboard workflows.',
    features: ['Capital dashboard', 'Contributor onboarding', 'Stripe handoff', 'Product routing', 'Certificate linkage', 'Compliance notes'],
    checklist: ['Add capital route', 'Connect product cards', 'Connect certificate records', 'Prepare API bridge']
  },
  {
    ...defaultSystemFields,
    title: 'Products & Commerce',
    shortTitle: 'Products',
    slug: 'products',
    route: '/products',
    category: 'Commerce Layer',
    productionStatus: 'In Development',
    priority: 'High',
    visibility: 'Public',
    iconKey: 'shopping-bag',
    odinCode: 'ODIN-COM-PROD-001',
    connectedSystemIds: ['capital', 'certificates', 'media'],
    description: 'Product catalog interface for digital downloads, books, certificates, apparel, media products, collectibles, tools, and commercial OneGodian offerings.',
    features: ['Product cards', 'Store handoff', 'Digital downloads', 'Featured products', 'WooCommerce bridge', 'Stripe readiness'],
    checklist: ['Product route active', 'Commerce integration pending', 'Download records pending']
  },
  {
    ...defaultSystemFields,
    title: 'Certificates',
    slug: 'certificates',
    route: '/certificates',
    category: 'Verification Layer',
    productionStatus: 'In Development',
    priority: 'High',
    visibility: 'Public',
    iconKey: 'badge-check',
    odinCode: 'ODIN-CERT-CORE-001',
    connectedSystemIds: ['registry', 'products', 'capital'],
    description: 'Certificate and verification layer for OneGodian records, alignment certificates, membership credentials, product certificates, and OBP-1 style verification records.',
    features: ['Certificate cards', 'Badge records', 'Proof objects', 'Verification links', 'QR validation', 'Holder dashboards'],
    checklist: ['Certificate shell active', 'QR verification pending', 'Issuer management pending']
  },
  {
    ...defaultSystemFields,
    title: 'Media Center',
    shortTitle: 'Media',
    slug: 'media',
    route: '/media',
    category: 'Media Center',
    productionStatus: 'Planned',
    priority: 'Medium',
    visibility: 'Public',
    iconKey: 'image',
    odinCode: 'ODIN-MEDIA-CORE-001',
    connectedSystemIds: ['planets', 'galaxy', 'products'],
    description: 'Central media layer for videos, audio, images, banners, planet visuals, founder media, explainers, launch content, and branded OneGodian assets.',
    features: ['Image library', 'Video library', 'Brand assets', 'Download center', 'Audio library', 'Launch visuals'],
    checklist: ['Media route pending', 'Asset library pending', 'Download center pending']
  },
  {
    ...defaultSystemFields,
    title: 'Founder Profile',
    shortTitle: 'Profile',
    slug: 'profile',
    route: '/profile',
    category: 'User Layer',
    productionStatus: 'Planned',
    priority: 'Medium',
    visibility: 'Public',
    iconKey: 'user',
    odinCode: 'ODIN-ID-FOUNDER-001',
    connectedSystemIds: ['registry', 'media', 'certificates'],
    description: 'Founder and official authorship profile for One Gregory Onegodian™, including identity, authorship, chronology, systems created, and institutional positioning.',
    features: ['Founder biography', 'Authorship record', 'Chronology', 'Official links', 'Certificate history', 'Identity preferences'],
    checklist: ['Profile route pending', 'Auth pending', 'Institutional-safe language pending']
  }
];

export const criticalSystems = appModules.filter((module) => module.priority === 'Critical');
export const liveSystems = appModules.filter((module) => module.productionStatus === 'Live');

export function getAppModuleBySlug(slug: string) {
  return appModules.find((module) => module.slug === slug);
}

export function getAppModulesByCategory(category: SystemCategory) {
  return appModules.filter((module) => module.category === category);
}

export function getConnectedModules(module: AppModule) {
  return appModules.filter((candidate) => module.connectedSystemIds?.includes(candidate.slug));
}
