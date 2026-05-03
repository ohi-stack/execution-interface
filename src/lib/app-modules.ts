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
    route: '/',
    category: 'Command Hub',
    productionStatus: 'Live',
    priority: 'Critical',
    iconKey: 'layout-dashboard',
    description: 'Central operating view for app modules, priorities, and system status.',
    features: ['Module overview', 'Production status', 'Quick access', 'Mobile app shell'],
    checklist: ['Homepage live', 'Navigation active', 'Mobile layout active']
  },
  {
    title: 'Ecosystem',
    slug: 'ecosystem',
    route: '/ecosystem',
    category: 'System Directory',
    productionStatus: 'Live',
    priority: 'Critical',
    iconKey: 'network',
    description: 'Connected OneGodian platforms, domains, repositories, and deployment targets.',
    features: ['Domain directory', 'Repo mapping', 'Deployment checklist', 'System detail pages'],
    checklist: ['Ecosystem page live', 'System cards active', 'Detail pages pending']
  },
  {
    title: 'Registry', slug: 'registry', route: '/registry', category: 'ODIN Index', productionStatus: 'In Development', priority: 'High', iconKey: 'database',
    description: 'Registry categories for products, certificates, planets, systems, and official records.',
    features: ['ODIN categories', 'Search', 'Record cards', 'Verification handoff'],
    checklist: ['Registry shell active', 'Search pending', 'API sync pending']
  },
  {
    title: 'Games', slug: 'games', route: '/games', category: 'Interactive Layer', productionStatus: 'Demo Ready', priority: 'High', iconKey: 'gamepad-2',
    description: 'Interactive games, prize-room demos, and educational play modules.',
    features: ['Bingo demo', 'Game library', 'History tab', 'Mobile gameplay'],
    checklist: ['Games route needed', 'Bingo route needed', 'Backend multiplayer pending']
  },
  {
    title: 'Planets', slug: 'planets', route: '/planets', category: 'Planetary Canon', productionStatus: 'Live', priority: 'High', iconKey: 'orbit',
    description: 'OneGodian Galaxy™ planetary registry and world-building archive.',
    features: ['Planet cards', 'Canon records', 'Realm summaries', 'Expansion map'],
    checklist: ['Planet route live', 'Planet data active', 'Detail pages pending']
  },
  {
    title: 'Tools', slug: 'tools', route: '/tools', category: 'Utilities', productionStatus: 'In Development', priority: 'High', iconKey: 'wrench',
    description: 'Verification tools, time converters, calculators, and generators.',
    features: ['Time converter', 'Verification lookup', 'Generators', 'System utilities'],
    checklist: ['Tools shell active', 'Time tool active', 'Verification API pending']
  },
  {
    title: 'Products', slug: 'products', route: '/products', category: 'Commerce Layer', productionStatus: 'In Development', priority: 'High', iconKey: 'shopping-bag',
    description: 'Digital products, books, downloads, templates, and commercial offerings.',
    features: ['Product cards', 'Store handoff', 'Digital downloads', 'Featured products'],
    checklist: ['Product route active', 'Commerce integration pending']
  },
  {
    title: 'Certificates', slug: 'certificates', route: '/certificates', category: 'Verification Layer', productionStatus: 'In Development', priority: 'Medium', iconKey: 'badge-check',
    description: 'Certificates, badges, identity records, proof objects, and verification documents.',
    features: ['Certificate cards', 'Badge records', 'Proof objects', 'Verification links'],
    checklist: ['Certificate shell active', 'QR verification pending']
  },
  {
    title: 'Media', slug: 'media', route: '/media', category: 'Media Center', productionStatus: 'Planned', priority: 'Medium', iconKey: 'image',
    description: 'Visual assets, videos, brand files, launch visuals, and downloads.',
    features: ['Image library', 'Video library', 'Brand assets', 'Download center'],
    checklist: ['Media route pending', 'Asset library pending']
  },
  {
    title: 'Capital', slug: 'capital', route: '/capital', category: 'Commercial Layer', productionStatus: 'In Development', priority: 'Critical', iconKey: 'landmark',
    description: 'Capital formation, valuation, licensing, payments, and API subscription operations.',
    features: ['Capital dashboard', 'Instrument registry', 'Intake workflow', 'Licensing plans'],
    checklist: ['Capital routes live', 'API integration pending', 'Compliance review active']
  },
  {
    title: 'Profile', slug: 'profile', route: '/profile', category: 'User Layer', productionStatus: 'Planned', priority: 'Medium', iconKey: 'user',
    description: 'User identity, access level, member status, preferences, and saved activity.',
    features: ['Profile', 'Access level', 'Saved records', 'Member identity'],
    checklist: ['Profile route pending', 'Auth pending']
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
    checklist: ['Create /algorithm landing page', 'Add four-layer architecture', 'Add white paper and API-ready endpoint links']
  },
  {
    title: 'Belief Mapper Lite',
    slug: 'belief-mapper-lite',
    route: '/belief-mapper',
    category: 'Identity',
    productionStatus: 'Needs Setup',
    priority: 'Critical',
    iconKey: 'sparkles',
    description: 'Consent-first 3–5 question identity mapper that routes users to stage-aware OneGodian resources.',
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
    description: 'Public educational knowledge layer aligned to onegodian.org/learn with deep links to OneGodian U.',
    features: ['Knowledge index', 'Six-pillar structure', 'Course links to OneGodian U', 'Public reference layer'],
    checklist: ['Create /learn landing page', 'Add six pillar cards', 'Route course CTAs to https://u.onegodian.org']
  },
  {
    title: 'OneGodian U',
    slug: 'onegodian-u',
    route: 'https://u.onegodian.org',
    category: 'Education',
    productionStatus: 'Planned',
    priority: 'Critical',
    iconKey: 'book-open-check',
    description: 'Course execution platform for modules, credentials, account progress, and certification delivery.',
    features: ['Course shell', 'Authentication', 'Track-based programs', 'Certificate flow'],
    checklist: ['Create course shell', 'Create authentication flow', 'Connect CTAs from onegodian.org/learn']
  },
  {
    title: 'Visual Cover Standards',
    slug: 'visual-cover-standards',
    route: '/standards/visual-covers',
    category: 'Media',
    productionStatus: 'In Development',
    priority: 'High',
    iconKey: 'image',
    description: 'Cover-art standard requiring every scroll and companion cover to encode the title’s meaning.',
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
    checklist: ['Add positioning statement summary', 'Separate ONEGODIAN, LLC from Indigenous Nation of Onegodia governance', 'Add inquiry routing']
  },
];
