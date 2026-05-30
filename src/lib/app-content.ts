export type NavigationItem = {
  label: string;
  href: string;
};

export type DashboardCard = {
  title: string;
  description: string;
  href: string;
  status: string;
};

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

export const appHomeHero = {
  eyebrow: 'APP.ONEGODIAN.COM',
  title: 'OneGodian App Dashboard',
  description:
    'Unified OneGodian public/member dashboard for ecosystem navigation, OMOS interpretation, OneGodian Time, commerce, identity, institutional clarity, campaign access, and system status.',
  primaryCta: { label: 'Open System Status', href: '/status' },
  secondaryCta: { label: 'Explore Ecosystem', href: '/ecosystem' }
};

export const coreRoutes = [
  '/',
  '/ecosystem',
  '/overview',
  '/omos',
  '/algorithm',
  '/remember',
  '/time',
  '/commerce',
  '/identity',
  '/institutional',
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

export const rememberCampaign = {
  officialStartDate: 'May 9, 2026',
  onegodianDate: 'Wisdom 23, OT 0001',
  message: 'You were always One — you simply forgot. Remember who you are.',
  purpose:
    'A public-facing awareness campaign centered on remembrance, identity, dignity, unity, origin, and shared human connection through practical action and responsible participation.',
  dashboardFunctions: ['Campaign overview', 'Campaign media', 'Store product links', 'Creator resources', 'Member participation tools', 'Social captions', 'Campaign status']
};
