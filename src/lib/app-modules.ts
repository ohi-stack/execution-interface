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
  }
];
