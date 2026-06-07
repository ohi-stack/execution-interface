export type AppRoute = {
  label: string;
  href: string;
};

export type NavigationItem = AppRoute;

export type DashboardModule = {
  title: string;
  description: string;
  href: string;
  buttonLabel: string;
  status: string;
  accent?: 'cyan' | 'gold' | 'violet' | 'emerald' | 'magenta' | 'orange' | 'red' | 'silver';
};

export type DashboardCard = DashboardModule;

export type EcosystemPortal = {
  name: string;
  role: string;
  url: string;
  classification: string;
};

export type RouteStatus = {
  path: string;
  title: string;
  purpose: string;
  status: 'Live' | 'Operational' | 'Monitored';
};

export const beliefMapperRoutes = [
  '/belief-mapper',
  '/belief-mapper/start',
  '/belief-mapper/results',
  '/belief-mapper/profile',
  '/belief-mapper/journal',
  '/belief-mapper/certificate',
  '/belief-mapper/timeline',
  '/belief-mapper/premium'
];

export const appHomeHero = {
  eyebrow: 'APP.ONEGODIAN.COM',
  title: 'Welcome to the OneGodian App',
  description:
    'Unified access to the OneGodian ecosystem, member tools, registries, campaigns, media, learning, certificates, Belief Mapper™, and operational resources.',
  positioning:
    'The OneGodian App is the central access layer for the OneGodian ecosystem. It connects members, campaigns, registries, tools, certificates, media, learning resources, and operational systems into one structured interface.',
  primaryCta: { label: 'Open Dashboard', href: '/dashboard' },
  secondaryCta: { label: 'Start Belief Mapper™', href: '/belief-mapper/start' }
};

export const appMeta = appHomeHero;

export const coreRoutes = [
  '/',
  '/dashboard',
  '/members',
  '/campaigns',
  '/campaigns/remember',
  '/registry',
  '/tools',
  '/media',
  '/learn',
  '/certificates',
  '/support',
  '/settings',
  '/account',
  '/ecosystem',
  '/overview',
  '/omos',
  '/framework',
  '/algorithm',
  '/protocol',
  '/ohi',
  '/pipeline',
  '/docs',
  '/remember',
  '/time',
  '/commerce',
  '/identity',
  '/institutional',
  '/status',
  ...beliefMapperRoutes
];

export const appNavigation: NavigationItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Ecosystem', href: '/ecosystem' },
  { label: 'Docs', href: '/docs' },
  { label: 'Framework', href: '/framework' },
  { label: 'OMOS', href: '/omos' },
  { label: 'Algorithm', href: '/algorithm' },
  { label: 'Protocol', href: '/protocol' },
  { label: 'OHI', href: '/ohi' },
  { label: 'Remember', href: '/remember' },
  { label: 'Time', href: '/time' },
  { label: 'Commerce', href: '/commerce' },
  { label: 'Identity', href: '/identity' },
  { label: 'Institutional', href: '/institutional' },
  { label: 'Status', href: '/status' }
];

export const appDashboardCards: DashboardCard[] = [
  { title: 'Ecosystem', description: 'Platform map spanning public, app, commerce, education, OMOS, galaxy, and verification nodes.', href: '/ecosystem', buttonLabel: 'Open ecosystem', status: 'Active' },
  { title: 'OMOS', description: 'OneGodian Metaphysical Operating System protocol, runtime context, and manifest surfaces.', href: '/omos', buttonLabel: 'Open OMOS', status: 'Live' },
  { title: 'Remember', description: 'THE ONEGODIAN: Remember campaign page and participant resource entry.', href: '/remember', buttonLabel: 'Open campaign', status: 'Live' },
  { title: 'Membership', description: 'Membership entry route for profile records, participation tools, and dashboard workflows.', href: '/members', buttonLabel: 'Open members', status: 'Available' },
  { title: 'Commerce Engine', description: 'OneGodian.com commerce and identity product engine context for offerings and checkout.', href: '/commerce', buttonLabel: 'Open commerce', status: 'Live' },
  { title: 'Institutional Clarity', description: 'Institutional boundary language for public, private, and operational contexts.', href: '/institutional', buttonLabel: 'Open clarity', status: 'Live' },
  { title: 'Media Center', description: 'Campaign visuals, brand assets, music, video, and publishing surfaces.', href: '/media', buttonLabel: 'Open media', status: 'Available' },
  { title: 'Learning', description: 'Connect to U OneGodian courses, learning paths, student tools, and certificates.', href: '/learn', buttonLabel: 'Open learning', status: 'Connected' }
];

export const ecosystemPortals: EcosystemPortal[] = [
  { name: 'OneGodian.org', role: 'Official public identity, writings, remembrance, articles, and institutional explanation.', url: 'https://onegodian.org', classification: 'Public interpretation platform' },
  { name: 'OneGodian.com', role: 'Store, products, memberships, commerce, apparel, books, and digital downloads.', url: 'https://onegodian.com', classification: 'Commerce platform' },
  { name: 'u.OneGodian.com', role: 'Education, LMS, learning paths, student tools, and certificates.', url: 'https://u.onegodian.com', classification: 'Education platform' },
  { name: 'app.OneGodian.com', role: 'Public and member-facing dashboard for membership, certificates, campaigns, media, tools, and ecosystem access.', url: 'https://app.onegodian.com', classification: 'Application node' },
  { name: 'Galaxy OneGodian', role: 'Galaxy interface, planet navigator, planet-store gateway, and immersive ecosystem layer.', url: 'https://galaxy.onegodian.com', classification: 'Galaxy interface' },
  { name: 'OMOS OneGodian', role: 'OMOS protocol, specification, alignment system, and consciousness-centered operating model.', url: 'https://omos.onegodian.com', classification: 'Runtime/protocol node' },
  { name: 'QuantumOHI.com', role: 'Advanced systems and intelligence architecture context for OneGodian ecosystem design.', url: 'https://quantumohi.com', classification: 'Systems architecture site' }
];

export const ecosystemLinks = ecosystemPortals.map((portal) => ({ label: portal.name, href: portal.url }));

export const routeStatusRows: RouteStatus[] = coreRoutes.map((path) => ({
  path,
  title: path === '/' ? 'Home' : path.split('/').filter(Boolean).map((part) => part.replace(/-/g, ' ')).join(' / '),
  purpose: `Production route for ${path === '/' ? 'the OneGodian app landing surface' : path}.`,
  status: 'Live'
}));

export const appFooterBoundary =
  'ONEGODIAN, LLC is a private commercial/IP/software/media/education/e-commerce entity. Public materials are informational and do not imply governmental authority or exemption from applicable law.';

export const footerSections = [
  { title: 'App', links: appNavigation },
  { title: 'Ecosystem', links: ecosystemLinks.slice(0, 4) },
  { title: 'Operations', links: [{ label: 'Docs Hub', href: '/docs' }, { label: 'Health API', href: '/api/health' }, { label: 'Manifest API', href: '/api/manifest' }, { label: 'Status', href: '/status' }] },
  { title: 'Records', links: [{ label: 'Certificates', href: '/certificates' }, { label: 'Registry', href: '/registry' }, { label: 'Support', href: '/support' }] }
];

export const systemsModel = [
  { title: 'Public Layer', level: 'Public', description: 'Public routes, institutional clarity, campaign pages, and ecosystem navigation.', items: ['Routes', 'Campaigns', 'Ecosystem'] },
  { title: 'Member Layer', level: 'Member', description: 'Member dashboards, certificates, profile records, and participation tools.', items: ['Profiles', 'Certificates', 'Participation'] },
  { title: 'Runtime Layer', level: 'Runtime', description: 'OMOS APIs, health checks, manifests, automation, and production monitoring.', items: ['Health', 'Manifest', 'Automation'] }
];

export const appStructureLayers = ['Public Dashboard', 'Ecosystem', 'Overview', 'OMOS', 'Algorithm', 'Time', 'Commerce', 'Identity', 'Remember', 'Status'];

export const rememberCampaign = {
  officialStartDate: 'May 9, 2026',
  onegodianDate: 'Wisdom 23, OT 0001',
  message: 'You were always One — you simply forgot. Remember who you are.',
  purpose: 'A public-facing awareness campaign centered on remembrance, identity, unity, origin, and shared human connection.',
  dashboardFunctions: ['Campaign overview', 'Remember materials', 'Contribution and support pathways', 'Public outreach resources', 'Media and captions', 'Member participation tools', 'Campaign certificate pathways']
};

export const apiStatus = {
  app: 'OneGodian App',
  appUrl: 'https://app.onegodian.com',
  consoleUrl: 'https://console.onegodian.com',
  environment: 'Production',
  currentDateRecord: 'May 31, 2026'
};

export const appStatus = {
  ...apiStatus,
  store: 'https://onegodian.com',
  publicSite: 'https://onegodian.org',
  api: 'https://app.onegodian.com/api/health',
  activeCampaign: 'THE ONEGODIAN: Remember Campaign'
};

export const appBoundaryCopy = appFooterBoundary;

export const pluginCategories = [
  { title: 'Core Platform Plugins', plugins: ['OneGodian Platform Plugin', 'OneGodian App Bridge Plugin', 'OneGodian Members Plugin', 'OneGodian Certificates Plugin', 'OneGodian Registry Plugin'] }
];
