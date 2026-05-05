export type ProductionStatus = 'Live' | 'Demo Ready' | 'Staging' | 'In Development' | 'Needs Setup' | 'Planned' | 'Offline' | 'Blocked';
export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
export type ModuleLayer = 'core' | 'system' | 'tool' | 'media' | 'finance' | 'governance' | 'education' | 'registry';

export type ModuleAccess = {
  public: boolean;
  dashboard: boolean;
  admin: boolean;
};

export type ModuleApi = {
  enabled: boolean;
  endpoints: string[];
  status: 'ready' | 'stubbed' | 'missing' | 'not-required';
};

export type ModuleDocs = {
  exists: boolean;
  path: string;
  status: 'ready' | 'stubbed' | 'missing';
};

export type ModuleChecklist = {
  publicPage: boolean;
  dashboardView: boolean;
  adminView: boolean;
  apiRoute: boolean;
  dataModel: boolean;
  security: boolean;
  documentation: boolean;
  compliance: boolean;
  deployment: boolean;
};

export type AppModule = {
  title: string;
  slug: string;
  route: string;
  category: string;
  description: string;
  productionStatus: ProductionStatus;
  priority: Priority;
  iconKey: string;
  layer: ModuleLayer;
  features: string[];
  checklist: string[];
  access: ModuleAccess;
  api: ModuleApi;
  docs: ModuleDocs;
  readinessChecklist: ModuleChecklist;
  adminRoute: string;
  dashboardRoute: string;
};

export const REQUIRED_MODULE_CHECKLIST_KEYS: Array<keyof ModuleChecklist> = [
  'publicPage',
  'dashboardView',
  'adminView',
  'apiRoute',
  'dataModel',
  'security',
  'documentation',
  'compliance',
  'deployment'
];

export function getModuleReadinessScore(module: AppModule) {
  const completed = REQUIRED_MODULE_CHECKLIST_KEYS.filter((key) => module.readinessChecklist[key]).length;
  return Math.round((completed / REQUIRED_MODULE_CHECKLIST_KEYS.length) * 100);
}

export function getModuleReadinessLabel(module: AppModule) {
  const score = getModuleReadinessScore(module);
  if (module.productionStatus === 'Blocked' || score < 40) return 'Needs Work';
  if (score < 75) return 'In Progress';
  if (score < 100) return 'Nearly Ready';
  return 'Production Ready';
}

export function getModuleBySlug(slug: string) {
  return appModules.find((module) => module.slug === slug);
}

export function getModuleSummary() {
  return {
    total: appModules.length,
    productionReady: appModules.filter((module) => getModuleReadinessScore(module) === 100).length,
    live: appModules.filter((module) => module.productionStatus === 'Live').length,
    blocked: appModules.filter((module) => module.productionStatus === 'Blocked').length,
    missingDocs: appModules.filter((module) => !module.docs.exists).length,
    missingAdmin: appModules.filter((module) => !module.access.admin).length
  };
}

const defaultAdminRoute = (slug: string) => `/admin/modules/${slug}`;
const defaultDashboardRoute = (slug: string) => `/dashboard?module=${slug}`;
const docsPath = (slug: string) => `/docs/modules/${slug}.md`;

export const appModules: AppModule[] = [
  {
    title: 'Dashboard',
    slug: 'dashboard',
    route: '/dashboard',
    category: 'Command Hub',
    description: 'Central operations command surface for OneGodian modules, status cards, quick actions, and execution tracking.',
    productionStatus: 'Live',
    priority: 'Critical',
    iconKey: 'layout-dashboard',
    layer: 'core',
    features: ['Overview', 'Status cards', 'Module navigation'],
    checklist: ['Public route live', 'Dashboard view live', 'Docs stub required'],
    access: { public: true, dashboard: true, admin: true },
    api: { enabled: true, endpoints: ['/api/health', '/api/stats'], status: 'ready' },
    docs: { exists: true, path: docsPath('dashboard'), status: 'stubbed' },
    readinessChecklist: { publicPage: true, dashboardView: true, adminView: true, apiRoute: true, dataModel: true, security: true, documentation: true, compliance: true, deployment: true },
    adminRoute: defaultAdminRoute('dashboard'),
    dashboardRoute: '/dashboard'
  },
  {
    title: 'Members',
    slug: 'members',
    route: '/members',
    category: 'Membership Layer',
    productionStatus: 'In Development',
    priority: 'Critical',
    iconKey: 'users-round',
    description: 'OneGodian Members Plugin bridge, member tools, certificate access, resources, account handoff, and admin summary routing.',
    features: ['Plugin health bridge', 'Member certificate', 'Member tools', 'Admin summary', 'Resources', 'Account handoff'],
    checklist: [
      'Install OneGodian Members Plugin v1.1.0 in WordPress',
      'Confirm /wp-json/onegodian-members/v1/health responds',
      'Create /member-dashboard/ and /member-certificate/ WordPress pages',
      'Connect app cards to authenticated member endpoints'
    ]
  },
  {
    title: 'Ecosystem',
    slug: 'ecosystem',
    route: '/ecosystem',
    category: 'Directory',
    description: 'Connected systems directory for domains, infrastructure, platform bridges, and synchronized ecosystem records.',
    productionStatus: 'Live',
    priority: 'Critical',
    iconKey: 'network',
    layer: 'system',
    features: ['Directory', 'Infrastructure map', 'Production status'],
    checklist: ['Route live', 'System records active', 'Admin controls pending'],
    access: { public: true, dashboard: true, admin: false },
    api: { enabled: true, endpoints: ['/api/manifest', '/api/stats'], status: 'stubbed' },
    docs: { exists: true, path: docsPath('ecosystem'), status: 'stubbed' },
    readinessChecklist: { publicPage: true, dashboardView: true, adminView: false, apiRoute: true, dataModel: true, security: true, documentation: true, compliance: true, deployment: true },
    adminRoute: defaultAdminRoute('ecosystem'),
    dashboardRoute: defaultDashboardRoute('ecosystem')
  },
  {
    title: 'Registry',
    slug: 'registry',
    route: '/registry',
    category: 'ODIN',
    description: 'ODIN records, validation workflows, certificate continuity, and canonical registry data surfaces.',
    productionStatus: 'In Development',
    priority: 'High',
    iconKey: 'database',
    layer: 'registry',
    features: ['Records', 'Validation', 'Certificate linkage'],
    checklist: ['Build API sync', 'Add admin controls', 'Create registry docs'],
    access: { public: true, dashboard: true, admin: false },
    api: { enabled: true, endpoints: ['/api/registry', '/api/tools'], status: 'stubbed' },
    docs: { exists: false, path: docsPath('registry'), status: 'missing' },
    readinessChecklist: { publicPage: true, dashboardView: true, adminView: false, apiRoute: false, dataModel: true, security: false, documentation: false, compliance: true, deployment: false },
    adminRoute: defaultAdminRoute('registry'),
    dashboardRoute: defaultDashboardRoute('registry')
  },
  {
    title: 'Planets',
    slug: 'planets',
    route: '/galaxy/planets',
    category: 'Canon',
    description: 'Planetary canon, moons, systems, realms, and OneGodian Galaxy records.',
    productionStatus: 'Live',
    priority: 'Medium',
    iconKey: 'orbit',
    layer: 'system',
    features: ['Cards', 'Canon listing', 'Moon system links'],
    checklist: ['Live', 'Add source docs', 'Add admin canon editor'],
    access: { public: true, dashboard: true, admin: false },
    api: { enabled: false, endpoints: [], status: 'not-required' },
    docs: { exists: false, path: docsPath('planets'), status: 'missing' },
    readinessChecklist: { publicPage: true, dashboardView: true, adminView: false, apiRoute: true, dataModel: true, security: true, documentation: false, compliance: true, deployment: true },
    adminRoute: defaultAdminRoute('planets'),
    dashboardRoute: defaultDashboardRoute('planets')
  },
  {
    title: 'Tools',
    slug: 'tools',
    route: '/tools',
    category: 'Utilities',
    description: 'Operational tools, calculators, command utilities, and app-level tool routing.',
    productionStatus: 'In Development',
    priority: 'High',
    iconKey: 'wrench',
    layer: 'tool',
    features: ['Utilities', 'Tool list', 'Operational actions'],
    checklist: ['Expand', 'Add API tool registry', 'Add admin tool management'],
    access: { public: true, dashboard: true, admin: false },
    api: { enabled: true, endpoints: ['/api/tools'], status: 'stubbed' },
    docs: { exists: false, path: docsPath('tools'), status: 'missing' },
    readinessChecklist: { publicPage: true, dashboardView: true, adminView: false, apiRoute: true, dataModel: false, security: false, documentation: false, compliance: true, deployment: false },
    adminRoute: defaultAdminRoute('tools'),
    dashboardRoute: defaultDashboardRoute('tools')
  },
  {
    title: 'Media',
    slug: 'media',
    route: '/media',
    category: 'Media',
    description: 'Media center for images, banners, cover standards, video, audio, and downloadable assets.',
    productionStatus: 'Live',
    priority: 'Medium',
    iconKey: 'image',
    layer: 'media',
    features: ['Assets', 'Visual standards', 'Media routes'],
    checklist: ['Live', 'Add media source docs', 'Add upload/admin controls'],
    access: { public: true, dashboard: true, admin: false },
    api: { enabled: false, endpoints: [], status: 'not-required' },
    docs: { exists: false, path: docsPath('media'), status: 'missing' },
    readinessChecklist: { publicPage: true, dashboardView: true, adminView: false, apiRoute: true, dataModel: true, security: true, documentation: false, compliance: true, deployment: true },
    adminRoute: defaultAdminRoute('media'),
    dashboardRoute: defaultDashboardRoute('media')
  },
  {
    title: 'Capital',
    slug: 'capital',
    route: '/capital',
    category: 'Economic',
    description: 'Economic intelligence, capital dashboards, product/funding summaries, and app bridge integration.',
    productionStatus: 'Staging',
    priority: 'High',
    iconKey: 'landmark',
    layer: 'finance',
    features: ['Metrics', 'Capital API endpoints', 'Funding cards'],
    checklist: ['Refine', 'Verify disclaimers', 'Connect live data'],
    access: { public: true, dashboard: true, admin: false },
    api: { enabled: true, endpoints: ['/api/capital/summary', '/api/capital/products'], status: 'stubbed' },
    docs: { exists: false, path: docsPath('capital'), status: 'missing' },
    readinessChecklist: { publicPage: true, dashboardView: true, adminView: false, apiRoute: true, dataModel: true, security: false, documentation: false, compliance: false, deployment: false },
    adminRoute: defaultAdminRoute('capital'),
    dashboardRoute: defaultDashboardRoute('capital')
  },
  {
    title: 'OMOS',
    slug: 'omos',
    route: '/omos',
    category: 'Systems',
    description: 'OMOS plugin bridge dashboard, runtime controls, bridge status, and secure tool communication.',
    productionStatus: 'Staging',
    priority: 'Critical',
    iconKey: 'network',
    layer: 'system',
    features: ['Bridge', 'LLM chat bridge', 'Plugin telemetry'],
    checklist: ['Configure OMOS env', 'Validate /api/omos/llm/chat', 'Add admin key rotation'],
    access: { public: true, dashboard: true, admin: false },
    api: { enabled: true, endpoints: ['/api/omos/llm/chat'], status: 'stubbed' },
    docs: { exists: false, path: docsPath('omos'), status: 'missing' },
    readinessChecklist: { publicPage: true, dashboardView: true, adminView: false, apiRoute: true, dataModel: true, security: false, documentation: false, compliance: true, deployment: false },
    adminRoute: defaultAdminRoute('omos'),
    dashboardRoute: defaultDashboardRoute('omos')
  },

  {
    title: 'App Structure Standard',
    slug: 'app-structure-standard',
    route: '/standards/app-structure',
    category: 'Governance',
    description: 'OneGodian App Core enforcement module that tracks 10-layer readiness requirements across public, dashboard, admin, API, data, security, UX, docs, compliance, and deployment.',
    productionStatus: 'In Development',
    priority: 'Critical',
    iconKey: 'shield',
    layer: 'governance',
    features: ['Layer requirements', 'Checklist enforcement', 'Cross-layer stubs'],
    checklist: ['Public page live', 'Admin stub live', 'API/data/security/compliance/deployment marked planned'],
    access: { public: true, dashboard: true, admin: true },
    api: { enabled: false, endpoints: ['/api/standards/app-structure'], status: 'stubbed' },
    docs: { exists: true, path: '/docs/onegodian-runtime-standard.md', status: 'ready' },
    readinessChecklist: { publicPage: true, dashboardView: true, adminView: true, apiRoute: false, dataModel: false, security: false, documentation: true, compliance: false, deployment: false },
    adminRoute: '/admin/modules/app-structure',
    dashboardRoute: defaultDashboardRoute('app-structure-standard')
  },

];
