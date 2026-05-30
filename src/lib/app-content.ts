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
    'Unified OneGodian public/member application for ecosystem navigation, OMOS content, time systems, campaign pages, commerce routing, and dashboard access.',
  primaryCta: {
    label: 'Open Dashboard',
    href: '/dashboard'
  },
  secondaryCta: {
    label: 'Explore Ecosystem',
    href: '/ecosystem'
  }
    'Unified OneGodian public/member dashboard for ecosystem navigation, OMOS interpretation, OneGodian Time, commerce, identity, institutional clarity, campaign access, and system status.',
  primaryCta: { label: 'Open System Status', href: '/status' },
  secondaryCta: { label: 'Explore Ecosystem', href: '/ecosystem' }
};

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
  '/algorithm',
  '/remember',
  '/time',
  '/commerce',
  '/identity',
  '/institutional',
  '/status',
  ...beliefMapperRoutes
  '/status'
];

export const appNavigation: NavigationItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Ecosystem', href: '/ecosystem' },
  { label: 'Overview', href: '/overview' },
  { label: 'OMOS', href: '/omos' },
  { label: 'Algorithm', href: '/algorithm' },
  { label: 'Remember', href: '/remember' },
  { label: 'Time', href: '/time' },
  { label: 'Commerce', href: '/commerce' },
  { label: 'Identity', href: '/identity' },
  { label: 'Institutional', href: '/institutional' },
  { label: 'Status', href: '/status' }
];

export const appDashboardCards = [
  { title: 'Ecosystem', description: 'Platform map spanning public, app, commerce, education, OMOS, galaxy, and verification nodes.', href: '/ecosystem', status: 'Active' },
  { title: 'OMOS', description: 'OneGodian Metaphysical Operating System protocol, runtime context, and manifest surfaces.', href: '/omos', status: 'Live' },
  { title: 'Remember', description: 'THE ONEGODIAN: Remember campaign page and participant resource entry.', href: '/remember', status: 'Live' },
  { title: 'Membership', description: 'Membership entry route for profile records, participation tools, and dashboard workflows.', href: '/membership', status: 'Available' },
  { title: 'Commerce Engine', description: 'OneGodian.com commerce and identity product engine context for offerings and checkout.', href: '/commerce', status: 'Live' },
  { title: 'Institutional Clarity', description: 'Institutional boundary language for public, private, and operational contexts.', href: '/institutional', status: 'Live' },
  { title: 'Media Center', description: 'Campaign visuals, brand assets, music, video, and publishing surfaces.', href: '/media', status: 'Available' },
  { title: 'Products', description: 'Products, digital downloads, apparel, books, and ecosystem offerings.', href: '/products', status: 'Available' },
  { title: 'Learning', description: 'Connect to U OneGodian courses, learning paths, student tools, and certificates.', href: '/learning', status: 'Connected' }
];

export const ecosystemPortals = [
  { name: 'OneGodian.org', role: 'Official public identity, writings, remembrance, articles, and institutional explanation.', url: 'https://onegodian.org' },
  { name: 'OneGodian.com', role: 'Store, products, memberships, commerce, apparel, books, and digital downloads.', url: 'https://onegodian.com' },
  { name: 'u.OneGodian.com', role: 'Education, LMS, learning paths, student tools, and certificates.', url: 'https://u.onegodian.com' },
  { name: 'app.OneGodian.com', role: 'Public and member-facing dashboard for membership, certificates, campaigns, media, tools, and ecosystem access.', url: 'https://app.onegodian.com' },
  { name: 'Galaxy OneGodian', role: 'Galaxy interface, planet navigator, planet-store gateway, and immersive ecosystem layer.', url: 'https://galaxy.onegodian.com' },
  { name: 'OMOS OneGodian', role: 'OMOS protocol, specification, alignment system, and consciousness-centered operating model.', url: 'https://omos.onegodian.com' },
  { name: 'QuantumOHI.com', role: 'Advanced systems and intelligence architecture context for OneGodian ecosystem design.', url: 'https://quantumohi.com' },
  { name: 'QRV.Network', role: 'Verification and trust infrastructure connected to OneGodian records and identity workflows.', url: 'https://qrv.network' }
export const appDashboardCards: DashboardCard[] = [
  {
    title: 'OMOS',
    description: 'OneGodian Metaphysical Operating System outline for identity, meaning, ethics, language, rituals, protocol, and application behavior.',
    href: '/omos',
    status: 'Live'
  },
  {
    title: 'OneGodian Algorithm',
    description: 'Four-layer algorithm summary: Protocol, Experience, Community, and Orientation.',
    href: '/algorithm',
    status: 'Live'
  },
  {
    title: 'OneGodian Time',
    description: 'OTS-V5 corrected timekeeping with Gregorian legal control and UTC system truth.',
    href: '/time',
    status: 'Live'
  },
  {
    title: 'Commerce',
    description: 'OneGodian.com as the commerce and identity product engine for products, memberships, checkout, and fulfillment.',
    href: '/commerce',
    status: 'Live'
  },
  {
    title: 'Institutional Clarity',
    description: 'Clear separation between ONEGODIAN, LLC commercial operations and INO voluntary internal governance/religious association structure.',
    href: '/institutional',
    status: 'Live'
  },
  {
    title: 'Membership / Identity',
    description: 'Identity and membership records for voluntary participation, credentials, profiles, and member-facing continuity.',
    href: '/identity',
    status: 'Live'
  },
  {
    title: 'Remember Campaign',
    description: 'Public campaign inviting remembrance of identity, dignity, unity, origin, and responsible participation.',
    href: '/remember',
    status: 'Live'
  },
  {
    title: 'System Status',
    description: 'Route table, manifest coverage, and production surface status for the OneGodian App.',
    href: '/status',
    status: 'Monitored'
  }
];

export const ecosystemPortals: EcosystemPortal[] = [
  {
    name: 'OneGodian.com',
    role: 'Commerce and identity product engine for ONEGODIAN, LLC products, memberships, checkout, fulfillment, and product-linked identity flows.',
    url: 'https://onegodian.com',
    classification: 'Commercial product engine'
  },
  {
    name: 'OneGodian.org',
    role: 'Civil, cultural, educational, and human-facing interpretation platform for public context, remembrance language, and non-commerce orientation.',
    url: 'https://onegodian.org',
    classification: 'Public interpretation platform'
  },
  {
    name: 'app.OneGodian.com',
    role: 'Unified public/member application dashboard for routes, campaign access, status surfaces, and member-oriented tools.',
    url: 'https://app.onegodian.com',
    classification: 'Application dashboard'
  },
  {
    name: 'u.OneGodian.com',
    role: 'Education and learning pathway surface for curriculum, course delivery, and learning records.',
    url: 'https://u.onegodian.com',
    classification: 'Education platform'
  },
  {
    name: 'OMOS.OneGodian.com',
    role: 'OMOS specification and runtime documentation node for protocol, manifest, and operating model references.',
    url: 'https://omos.onegodian.com',
    classification: 'Protocol documentation'
  },
  {
    name: 'galaxy.OneGodian.com',
    role: 'World, story, media, and discovery surface connected to OneGodian cultural and product experiences.',
    url: 'https://galaxy.onegodian.com',
    classification: 'Experience layer'
  },
  {
    name: 'QuantumOHI.com',
    role: 'OHI systems architecture and intelligence positioning for the broader ecosystem model.',
    url: 'https://quantumohi.com',
    classification: 'Systems architecture'
  },
  {
    name: 'QRV.Network',
    role: 'Verification and trust infrastructure for identity, record, and credential workflows.',
    url: 'https://qrv.network',
    classification: 'Verification infrastructure'
  }
];

export const routeStatusRows: RouteStatus[] = [
  { path: '/', title: 'Home Dashboard', purpose: 'Unified OneGodian App dashboard and route launchpad.', status: 'Live' },
  { path: '/ecosystem', title: 'Ecosystem', purpose: 'Production ecosystem map for commerce, interpretation, app, education, protocol, and verification surfaces.', status: 'Live' },
  { path: '/overview', title: 'ONEGODIAN, LLC Overview', purpose: 'May 26, 2026 commercial overview and production role summary.', status: 'Live' },
  { path: '/omos', title: 'OMOS', purpose: 'OneGodian Metaphysical Operating System outline.', status: 'Live' },
  { path: '/algorithm', title: 'OneGodian Algorithm', purpose: 'Four-layer protocol, experience, community, and orientation summary.', status: 'Live' },
  { path: '/remember', title: 'Remember Campaign', purpose: 'Public remembrance campaign page.', status: 'Live' },
  { path: '/time', title: 'OneGodian Time / OTS-V5', purpose: 'Corrected timekeeping content with Gregorian and UTC legal safety language.', status: 'Live' },
  { path: '/commerce', title: 'Commerce', purpose: 'OneGodian.com commerce and identity product engine.', status: 'Live' },
  { path: '/identity', title: 'Membership / Identity', purpose: 'Membership, identity, credential, and voluntary participation context.', status: 'Live' },
  { path: '/institutional', title: 'Institutional Clarity', purpose: 'Boundary between ONEGODIAN, LLC and INO.', status: 'Live' },
  { path: '/status', title: 'System Status', purpose: 'Route status table and manifest coverage.', status: 'Monitored' }
];

export const footerSections = [
  {
    title: 'OneGodian App',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Ecosystem', href: '/ecosystem' },
      { label: 'Overview', href: '/overview' },
      { label: 'Status', href: '/status' }
    ]
  },
  {
    title: 'Core Content',
    links: [
      { label: 'OMOS', href: '/omos' },
      { label: 'Algorithm', href: '/algorithm' },
      { label: 'Time', href: '/time' },
      { label: 'Remember', href: '/remember' }
    ]
  },
  {
    title: 'Operations',
    links: [
      { label: 'Commerce', href: '/commerce' },
      { label: 'Identity', href: '/identity' },
      { label: 'Institutional', href: '/institutional' }
    ]
  },
  {
    title: 'External Engines',
    links: [
      { label: 'OneGodian.com', href: 'https://onegodian.com' },
      { label: 'OneGodian.org', href: 'https://onegodian.org' }
    ]
  }
];

export const appFooterBoundary =
  'ONEGODIAN, LLC is a private commercial/IP/software/media/education/e-commerce entity. INO is separate and described as a voluntary internal governance/religious association structure. Sovereign language means internal self-governance and voluntary participation, not exemption from U.S. law, nation-state status, or governmental authority over non-members.';

export const systemsModel = [
  { title: 'Public App', items: ['Home dashboard', 'Ecosystem', 'Overview', 'Status'] },
  { title: 'Operating Model', items: ['OMOS', 'Algorithm', 'Time', 'Institutional clarity'] },
  { title: 'Participation', items: ['Commerce', 'Identity', 'Remember Campaign'] }
];

export const apiStatus = {
  app: 'OneGodian App',
  appUrl: 'https://app.onegodian.com',
  environment: 'Production',
  currentDateRecord: 'May 30, 2026'
};

export const appStatus = {
  ...apiStatus,
  store: 'https://onegodian.com',
  publicSite: 'https://onegodian.org',
  activeCampaign: 'THE ONEGODIAN: Remember Campaign',
  api: 'https://app.onegodian.com/api/health'
};

export const pluginCategories = [
  { title: 'Core Platform Plugins', plugins: ['OneGodian Platform Plugin', 'OneGodian App Bridge Plugin', 'OneGodian Members Plugin', 'OneGodian Certificates Plugin', 'OneGodian Registry Plugin'] }
];

export const appNavigation: AppRoute[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Belief Mapper™', href: '/belief-mapper' },
  { label: 'Members', href: '/members' },
  { label: 'Campaigns', href: '/campaigns' },
  { label: 'Registry', href: '/registry' },
  { label: 'Tools', href: '/tools' },
  { label: 'Media', href: '/media' },
  { label: 'Learning', href: '/learn' },
  { label: 'Certificates', href: '/certificates' },
  { label: 'Support', href: '/support' },
  { label: 'Account', href: '/account' },
  { label: 'Settings', href: '/settings' }
];

export const appDashboardCards: DashboardModule[] = [
  {
    title: 'Belief Mapper™',
    description: 'Mobile-first swipe/tap question flow that maps users to Seeker, Believer, Onegodian, or Elder next-step pathways with consent-first handling.',
    href: '/belief-mapper',
    buttonLabel: 'Start Mapping',
    status: 'New',
    accent: 'violet'
  },
  {
    title: 'Members',
    description: 'Access your OneGodian member profile, membership status, digital ID, certificate records, and community tools.',
    href: '/members',
    buttonLabel: 'Open Members',
    status: 'Active',
    accent: 'cyan'
  },
  {
    title: 'Remember Campaign',
    description: 'Preserve memory, identity, origin, purpose, dignity, unity, and disciplined growth through the OneGodian Remember Campaign.',
    href: '/campaigns/remember',
    buttonLabel: 'Open Remember Campaign',
    status: 'Featured',
    accent: 'violet'
  },
  {
    title: 'Registry',
    description: 'Access ODIN records, verification entries, certificates, archived filings, and system records.',
    href: '/registry',
    buttonLabel: 'Open Registry',
    status: 'Active',
    accent: 'emerald'
  },
  {
    title: 'Tools',
    description: 'Use OneGodian utilities, forms, calculators, onboarding tools, conversion tools, and internal app resources.',
    href: '/tools',
    buttonLabel: 'Open Tools',
    status: 'Active',
    accent: 'orange'
  },
  {
    title: 'Learning',
    description: 'Enter OneGodian education pathways, courses, onboarding, resources, and certification materials.',
    href: '/learn',
    buttonLabel: 'Start Learning',
    status: 'Connected',
    accent: 'silver'
  },
  {
    title: 'Certificates',
    description: 'View, request, or verify OneGodian certificates, membership confirmations, campaign certificates, and digital credentials.',
    href: '/certificates',
    buttonLabel: 'Open Certificates',
    status: 'Active',
    accent: 'emerald'
  },
  {
    title: 'System Status',
    description: 'Route table, manifest coverage, and production surface status for the OneGodian App.',
    href: '/status',
    buttonLabel: 'Open Status',
    status: 'Monitored',
    accent: 'cyan'
  }
];

export const ecosystemPortals: EcosystemPortal[] = [
  { name: 'OneGodian.org', role: 'Public explanation, writings, remembrance, and institutional context.', url: 'https://onegodian.org', classification: 'Public interpretation platform' },
  { name: 'OneGodian.com', role: 'Commerce and identity product engine.', url: 'https://onegodian.com', classification: 'Commercial product engine' },
  { name: 'u.OneGodian.com', role: 'Learning pathways, course delivery, and student services.', url: 'https://u.onegodian.com', classification: 'Education platform' },
  { name: 'app.OneGodian.com', role: 'Unified ecosystem app for members, dashboards, registries, tools, certificates, media, and campaigns.', url: 'https://app.onegodian.com', classification: 'Application dashboard' },
  { name: 'OMOS.OneGodian.com', role: 'Operating system documentation and protocol structure.', url: 'https://omos.onegodian.com', classification: 'Protocol documentation' },
  { name: 'Galaxy OneGodian', role: 'Immersive ecosystem and world navigation layer.', url: 'https://galaxy.onegodian.com', classification: 'Experience layer' },
  { name: 'QuantumOHI.com', role: 'Advanced systems and intelligence architecture context.', url: 'https://quantumohi.com', classification: 'Systems architecture' },
  { name: 'QRV.Network', role: 'Verification and trust infrastructure.', url: 'https://qrv.network', classification: 'Verification infrastructure' }
];

export const routeStatusRows: RouteStatus[] = [
  { path: '/', title: 'Home Dashboard', purpose: 'Unified OneGodian App dashboard and route launchpad.', status: 'Live' },
  { path: '/dashboard', title: 'Central Dashboard', purpose: 'Member-facing module grid and access layer.', status: 'Live' },
  { path: '/belief-mapper', title: 'Belief Mapper™', purpose: 'Consent-first belief journey mapping route group.', status: 'Live' },
  { path: '/belief-mapper/start', title: 'Belief Mapper™ Start', purpose: 'Mobile-first swipe/tap question flow.', status: 'Live' },
  { path: '/belief-mapper/results', title: 'Belief Mapper™ Results', purpose: 'Result profile library and follow-up capture.', status: 'Live' },
  { path: '/belief-mapper/profile', title: 'Belief Mapper™ Profile', purpose: 'Saved profile and next-step routing surface.', status: 'Live' },
  { path: '/belief-mapper/journal', title: 'Belief Mapper™ Journal', purpose: 'Private reflection checkpoint.', status: 'Live' },
  { path: '/belief-mapper/certificate', title: 'Belief Mapper™ Certificate', purpose: 'Certificate preview and credential readiness surface.', status: 'Live' },
  { path: '/belief-mapper/timeline', title: 'Belief Mapper™ Timeline', purpose: 'Journey timeline and progress model.', status: 'Live' },
  { path: '/belief-mapper/premium', title: 'Belief Mapper™ Premium', purpose: 'Premium upgrade and advanced tooling overview.', status: 'Live' },
  { path: '/ecosystem', title: 'Ecosystem', purpose: 'Production ecosystem map for commerce, interpretation, app, education, protocol, and verification surfaces.', status: 'Live' },
  { path: '/status', title: 'System Status', purpose: 'Route table, manifest coverage, and production surface status.', status: 'Monitored' }
];

export const footerSections = [
  { title: 'App', links: appNavigation },
  { title: 'Belief Mapper™', links: beliefMapperRoutes.map((href) => ({ label: href.replace('/belief-mapper', '') || 'Home', href })) },
  { title: 'Ecosystem', links: ecosystemPortals.map((portal) => ({ label: portal.name, href: portal.url })) }
];

export const systemsModel = [
  { title: 'Access', items: ['Dashboard', 'Members', 'Account', 'Settings'] },
  { title: 'Ecosystem Use', items: ['Campaigns', 'Registry', 'Tools', 'Support', 'Belief Mapper™'] },
  { title: 'Knowledge & Records', items: ['Media', 'Learning', 'Certificates', 'Belief Profiles'] }
];

export const apiStatus = {
  app: 'OneGodian App',
  appUrl: 'https://app.onegodian.com',
  consoleUrl: 'https://console.onegodian.com',
  environment: 'Production',
  currentDateRecord: 'May 30, 2026'
};

export const appStatus = {
  ...apiStatus,
  store: 'https://onegodian.com',
  publicSite: 'https://onegodian.org',
  api: 'https://app.onegodian.com/api/health',
  activeCampaign: 'THE ONEGODIAN: Remember Campaign'
};

export const pluginCategories = [
  { title: 'Core Platform Plugins', plugins: ['OneGodian Platform Plugin', 'OneGodian App Bridge Plugin', 'OneGodian Members Plugin', 'OneGodian Certificates Plugin', 'OneGodian Registry Plugin'] }
];

export const rememberCampaign = {
  officialStartDate: 'May 9, 2026',
  onegodianDate: 'Wisdom 23, OT 0001',
  message: 'You were always One — you simply forgot. Remember who you are.',
  purpose:
    'A public-facing awareness campaign centered on remembrance, identity, dignity, unity, origin, and shared human connection through practical action and responsible participation.',
  dashboardFunctions: ['Campaign overview', 'Campaign media', 'Store product links', 'Creator resources', 'Member participation tools', 'Social captions', 'Campaign status']
};

export const appStructureLayers = ['Public App', 'Central Access Dashboard', 'Belief Mapper™', 'Member Dashboard', 'Identity Systems', 'Registries', 'Campaigns', 'Media', 'Learning', 'Certificates', 'Tools', 'Account Systems', 'Member Infrastructure'];

export const appFooterBoundary =
  'OneGodian App is the public/member node. Admin and control functions remain in designated console and control panel surfaces.';

export const appBoundaryCopy = appFooterBoundary;
export const ecosystemLinks = ecosystemPortals.map((portal) => ({ label: portal.name, href: portal.url }));
