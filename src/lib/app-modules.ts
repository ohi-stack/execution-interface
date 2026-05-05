export type ProductionStatus =
  | 'Live'
  | 'Demo Ready'
  | 'Staging'
  | 'In Development'
  | 'Needs Setup'
  | 'Planned'
  | 'Offline';

export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

export type AppModule = {
  title: string;
  slug: string;
  route: string;
  category: string;
  description: string;
  productionStatus: ProductionStatus;
  priority: Priority;
  iconKey: string;
  features: string[];
  checklist: string[];
};

export const appModules: AppModule[] = [
  {
    title: 'Dashboard',
    slug: 'dashboard',
    route: '/dashboard',
    category: 'Command Hub',
    productionStatus: 'Live',
    priority: 'Critical',
    iconKey: 'layout-dashboard',
    description: 'Main operating view for modules, priorities, system status, quick actions, recent activity, profile, notifications, and module navigation.',
    features: ['Main dashboard', 'System status cards', 'Quick actions', 'Recent activity', 'User/member profile', 'Notifications'],
    checklist: ['Dashboard route active', 'Status cards active', 'Live health widgets pending']
  },
  {
    title: 'Ecosystem',
    slug: 'ecosystem',
    route: '/ecosystem',
    category: 'System Directory',
    productionStatus: 'Live',
    priority: 'Critical',
    iconKey: 'network',
    description: 'Connected OneGodian platforms, domains, repositories, deployment targets, bridge targets, and production readiness states.',
    features: ['Domain directory', 'Repository mapping', 'Deployment targets', 'System detail links', 'Production checklist'],
    checklist: ['Ecosystem route active', 'System cards active', 'Detail pages pending']
  },
  {
    title: 'Registry',
    slug: 'registry',
    route: '/registry',
    category: 'Records & Verification',
    productionStatus: 'In Development',
    priority: 'High',
    iconKey: 'database',
    description: 'Registry categories for products, certificates, planets, systems, submissions, and official records.',
    features: ['Record cards', 'ODIN categories', 'Certificate records', 'Search', 'Verification handoff'],
    checklist: ['Registry shell active', 'Search pending', 'API sync pending']
  },
  {
    title: 'Tools',
    slug: 'tools',
    route: '/tools',
    category: 'Utilities & OMOS',
    productionStatus: 'In Development',
    priority: 'High',
    iconKey: 'wrench',
    description: 'OMOS tools, verification utilities, calculators, time tools, category explorers, and system diagnostics.',
    features: ['Tool list', 'Verification utilities', 'Time converter', 'System diagnostics', 'Generators'],
    checklist: ['Tools route active', 'OMOS bridge pending', 'Tool result persistence pending']
  },
  {
    title: 'Members',
    slug: 'members',
    route: '/members',
    category: 'Membership & Identity',
    productionStatus: 'In Development',
    priority: 'Critical',
    iconKey: 'id-card',
    description: 'Membership, profile, access levels, verification status, certificates, and logged-in member tools.',
    features: ['Member profiles', 'Access levels', 'Membership status', 'Certificate access', 'Member dashboard'],
    checklist: ['Members route active', 'Members plugin available', 'Auth/data integration pending']
  },
  {
    title: 'Certificates',
    slug: 'certificates',
    route: '/certificates',
    category: 'Verification Layer',
    productionStatus: 'In Development',
    priority: 'Medium',
    iconKey: 'badge-check',
    description: 'Certificates, badges, proof objects, identity records, and verification documents.',
    features: ['Certificate cards', 'Proof objects', 'Verification links', 'Record lookup'],
    checklist: ['Certificate shell active', 'QR-V verification pending', 'Export/download pending']
  },
  {
    title: 'Products',
    slug: 'products',
    route: '/products',
    category: 'Commerce Layer',
    productionStatus: 'In Development',
    priority: 'High',
    iconKey: 'shopping-bag',
    description: 'Digital products, books, downloads, templates, subscriptions, and commercial offerings.',
    features: ['Product cards', 'Store handoff', 'Digital downloads', 'Pricing/access levels'],
    checklist: ['Product route active', 'WooCommerce integration pending', 'Stripe checkout handoff pending']
  },
  {
    title: 'Media',
    slug: 'media',
    route: '/media',
    category: 'Media Center',
    productionStatus: 'In Development',
    priority: 'Medium',
    iconKey: 'clapperboard',
    description: 'Media engine for videos, audio, brand assets, press materials, galleries, and downloads.',
    features: ['Video library', 'Audio library', 'Brand assets', 'Press kit', 'Download center'],
    checklist: ['Media route active', 'Allatyme media plugin available', 'Asset ingestion pending']
  },
  {
    title: 'Settings',
    slug: 'settings',
    route: '/settings',
    category: 'Configuration',
    productionStatus: 'Planned',
    priority: 'High',
    iconKey: 'settings',
    description: 'User, app, bridge, environment, notification, and module settings.',
    features: ['User settings', 'Module settings', 'Environment guide', 'Notification controls'],
    checklist: ['Settings route needed', 'Settings schema pending', 'Persistence pending']
  },
  {
    title: 'Admin',
    slug: 'admin',
    route: '/admin',
    category: 'Control Panel',
    productionStatus: 'Planned',
    priority: 'Critical',
    iconKey: 'shield',
    description: 'Admin dashboard for settings, API keys, submissions, tools, status, production checklist, documentation, logs, and audit trail.',
    features: ['Admin dashboard', 'API keys', 'Submissions', 'Production checklist', 'Logs and audit trail'],
    checklist: ['Admin route needed', 'Role-based access pending', 'Audit logging pending']
  },
  {
    title: 'Developers',
    slug: 'developers',
    route: '/developers',
    category: 'API & Integration Layer',
    productionStatus: 'Planned',
    priority: 'High',
    iconKey: 'code-2',
    description: 'Developer center for API docs, repository links, bridge endpoints, app manifests, health routes, and integration instructions.',
    features: ['API docs', 'Repository links', 'App manifests', 'Health endpoints', 'Environment variables'],
    checklist: ['Developer route active', 'Endpoint docs pending', 'API health panel pending']
  },
  {
    title: 'Systems',
    slug: 'systems',
    route: '/systems',
    category: 'Infrastructure Layer',
    productionStatus: 'In Development',
    priority: 'Critical',
    iconKey: 'cpu',
    description: 'Core OneGodian infrastructure hierarchy, systems model, runtime relationships, execution model, and platform dependencies.',
    features: ['Hierarchy explorer', 'System layers', 'Infrastructure map', 'Execution model'],
    checklist: ['Systems route active', 'Hierarchy data active', 'Runtime dependency map pending']
  },
  {
    title: 'Capital',
    slug: 'capital',
    route: '/capital',
    category: 'Commercial Layer',
    productionStatus: 'In Development',
    priority: 'Critical',
    iconKey: 'landmark',
    description: 'Capital intake, valuation, licensing, payments, contributions, and compliance-safe public flows.',
    features: ['Capital dashboard', 'Instrument registry', 'Intake workflow', 'Licensing plans', 'Financial disclaimers'],
    checklist: ['Capital UI routes active', 'Capital API endpoints pending in onegodian-api', 'Compliance review active']
  },
  {
    title: 'Games',
    slug: 'games',
    route: '/games',
    category: 'Interactive Layer',
    productionStatus: 'Demo Ready',
    priority: 'High',
    iconKey: 'gamepad-2',
    description: 'Interactive games, prize-room demos, learning games, and engagement modules.',
    features: ['Bingo demo', 'Game library', 'History tab', 'Mobile gameplay'],
    checklist: ['Games route active', 'Demo disclaimer active', 'Backend multiplayer pending']
  },
  {
    title: 'Planets',
    slug: 'planets',
    route: '/planets',
    category: 'Planetary Canon',
    productionStatus: 'Live',
    priority: 'High',
    iconKey: 'orbit',
    description: 'OneGodian Galaxy™ planetary registry, planets, moons, canon records, and world-building archive.',
    features: ['Planet cards', 'Canon records', 'Realm summaries', 'Expansion map'],
    checklist: ['Planet route live', 'Planet data active', 'Detail pages pending']
  },
  {
    title: 'Production Structure Standard',
    slug: 'production-structure-standard',
    route: '/standards/production-structure',
    category: 'Documentation & Governance',
    productionStatus: 'Live',
    priority: 'Critical',
    iconKey: 'clipboard-check',
    description: 'Baseline ten-layer production structure required for every OneGodian app, plugin, module, and bridge.',
    features: ['Ten-layer structure', 'Required core pages', 'Required plugin/admin screens', 'Three-use rule'],
    checklist: ['Standard route active', 'App module registered', 'Enforce checklist across future modules']
  },
  {
    title: 'Onegodian Algorithm™',
    slug: 'algorithm',
    route: '/algorithm',
    category: 'AI Governance',
    productionStatus: 'In Development',
    priority: 'Critical',
    iconKey: 'brain-circuit',
    description: 'Four-layer AI governance framework for recognition, personalization, community intelligence, and AI/robotic behavioral orientation.',
    features: ['Protocol layer', 'Experience layer', 'Community layer', 'Orientation layer'],
    checklist: ['Algorithm landing page active', 'Whitepaper link pending', 'API-ready endpoint links pending']
  },
  {
    title: 'Belief Mapper Lite',
    slug: 'belief-mapper-lite',
    route: '/belief-mapper',
    category: 'Identity',
    productionStatus: 'Needs Setup',
    priority: 'Critical',
    iconKey: 'sparkles',
    description: 'Consent-first identity mapper that routes users to stage-aware OneGodian resources without storing sensitive belief data without explicit consent.',
    features: ['Question flow', 'Result stage mapping', 'Consent notice', 'Journey routing'],
    checklist: ['Build question flow', 'Create result states', 'Do not store belief data without explicit consent']
  },
  {
    title: 'OneGodian Learn',
    slug: 'learn',
    route: '/learn',
    category: 'Education',
    productionStatus: 'Needs Setup',
    priority: 'Critical',
    iconKey: 'graduation-cap',
    description: 'Public educational knowledge layer aligned to OneGodian learning pillars and course pathways.',
    features: ['Knowledge index', 'Learning pillars', 'Course links', 'Public reference layer'],
    checklist: ['Create /learn landing page', 'Add pillar cards', 'Route course CTAs to https://u.onegodian.org']
  },
  {
    title: 'Visual Cover Standards',
    slug: 'visual-cover-standards',
    route: '/standards/visual-covers',
    category: 'Media',
    productionStatus: 'In Development',
    priority: 'High',
    iconKey: 'image',
    description: 'Cover-art standard requiring every scroll, product, and companion cover to encode the title’s meaning.',
    features: ['Core principle', 'Dominant visual anchor rule', 'No-clutter rule', 'Prompt template guidance'],
    checklist: ['Create standard page', 'Add title-meaning encoding requirement', 'Add prompt template generator']
  },
  {
    title: 'Institutional Dossier',
    slug: 'institutional',
    route: '/institutional',
    category: 'Institutional',
    productionStatus: 'Needs Setup',
    priority: 'Critical',
    iconKey: 'landmark',
    description: 'Institutional-safe overview of ONEGODIAN, LLC, IP standing, legal documentation, and operating structure.',
    features: ['Positioning statement', 'Entity separation notes', 'IP reference', 'Inquiry routing'],
    checklist: ['Add positioning statement summary', 'Separate ONEGODIAN, LLC from INO governance', 'Add inquiry routing']
  }
];
