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
  { title: 'Dashboard', slug: 'dashboard', route: '/', category: 'Command Hub', productionStatus: 'Live', priority: 'Critical', iconKey: 'layout-dashboard', description: 'Central operating view for app modules, priorities, and system status.', features: ['Module overview', 'Production status', 'Quick access', 'Mobile app shell'], checklist: ['Homepage live', 'Navigation active', 'Mobile layout active'] },
  { title: 'Ecosystem', slug: 'ecosystem', route: '/ecosystem', category: 'System Directory', productionStatus: 'Live', priority: 'Critical', iconKey: 'network', description: 'Connected OneGodian platforms, domains, repositories, and deployment targets.', features: ['Domain directory', 'Repo mapping', 'Deployment checklist', 'System detail pages'], checklist: ['Ecosystem page live', 'System cards active', 'Detail pages pending'] },
  { title: 'Registry', slug: 'registry', route: '/registry', category: 'ODIN Index', productionStatus: 'In Development', priority: 'High', iconKey: 'database', description: 'Registry categories for products, certificates, planets, systems, and official records.', features: ['ODIN categories', 'Search', 'Record cards', 'Verification handoff'], checklist: ['Registry shell active', 'Search pending', 'API sync pending'] },
  { title: 'Systems', slug: 'systems', route: '/systems', category: 'Infrastructure Layer', productionStatus: 'In Development', priority: 'Critical', iconKey: 'cpu', description: 'Core OneGodian infrastructure hierarchy, including OHI, Quantum-OHI, OMOS, ACC, OBP-1, OTS-V5, registry systems, execution layers, and platform dependencies.', features: ['Hierarchy explorer', 'System layers', 'Infrastructure map', 'Runtime relationships', 'Execution model', 'Platform architecture'], checklist: ['Systems route needed', 'Hierarchy data needed', 'Layer visualization needed', 'Runtime dependency map pending'] },
  { title: 'Members', slug: 'members', route: '/members', category: 'Identity & Membership Layer', productionStatus: 'In Development', priority: 'Critical', iconKey: 'id-card', description: 'Membership, profile, identity, certificates, verification status, access levels, and member-facing dashboard tools.', features: ['Member profiles', 'Membership status', 'Certificate access', 'Verification tools', 'Member dashboard', 'Access levels'], checklist: ['Members plugin uploaded', 'Members route needed', 'Profile shell needed', 'Certificate handoff pending'] },
  { title: 'Identity', slug: 'identity', route: '/identity', category: 'Verification Layer', productionStatus: 'Planned', priority: 'High', iconKey: 'badge-check', description: 'Identity records, membership profiles, verification states, QR-V lookup, certificate ownership, and access permissions.', features: ['Identity records', 'Verification status', 'QR-V lookup', 'Certificate ownership', 'Access permissions', 'Member profile'], checklist: ['Identity route needed', 'Verification schema pending', 'QR-V API pending', 'Member data integration pending'] },
  { title: 'OMOS Tools', slug: 'omos-tools', route: '/tools', category: 'Alignment & Utilities Layer', productionStatus: 'In Development', priority: 'High', iconKey: 'brain-circuit', description: 'OMOS runtime tools, belief mapping, alignment utilities, verification widgets, time tools, category explorers, and system diagnostics.', features: ['OMOS runtime', 'Belief mapper', 'Time converter', 'Registry lookup', 'Certificate verifier', 'System diagnostics'], checklist: ['OMOS plugin uploaded', 'Tools route active or needed', 'Tool cards needed', 'API-backed tools pending'] },
  { title: 'Media', slug: 'media', route: '/media', category: 'Media Center', productionStatus: 'In Development', priority: 'Medium', iconKey: 'clapperboard', description: 'Unified media engine for videos, podcasts, music, brand assets, press materials, visual galleries, downloads, and platform media distribution.', features: ['Video library', 'Audio library', 'Brand assets', 'Press kit', 'Visual archive', 'Download center'], checklist: ['Allatyme media plugin uploaded', 'Media route needed', 'Asset categories needed', 'Download center pending'] },
  { title: 'Capital', slug: 'capital', route: '/capital', category: 'Commercial Layer', productionStatus: 'In Development', priority: 'Critical', iconKey: 'landmark', description: 'Capital formation, valuation, licensing, payments, and API subscription operations.', features: ['Capital dashboard', 'Instrument registry', 'Intake workflow', 'Licensing plans'], checklist: ['Capital routes live', 'API integration pending', 'Compliance review active'] },
  { title: 'Developers', slug: 'developers', route: '/developers', category: 'API & Integration Layer', productionStatus: 'Planned', priority: 'High', iconKey: 'code-2', description: 'Developer center for API documentation, repository links, bridge endpoints, app manifests, plugin health routes, and integration instructions.', features: ['API docs', 'Repository links', 'App bridge manifests', 'Health endpoints', 'Integration keys', 'Environment variables'], checklist: ['Developer route needed', 'Repo links available', 'Plugin bridge docs pending', 'API health panel pending'] },
  { title: 'Games', slug: 'games', route: '/games', category: 'Interactive Layer', productionStatus: 'Demo Ready', priority: 'High', iconKey: 'gamepad-2', description: 'Interactive games, prize-room demos, and educational play modules.', features: ['Bingo demo', 'Game library', 'History tab', 'Mobile gameplay'], checklist: ['Games route needed', 'Bingo route needed', 'Backend multiplayer pending'] },
  { title: 'Planets', slug: 'planets', route: '/planets', category: 'Planetary Canon', productionStatus: 'Live', priority: 'High', iconKey: 'orbit', description: 'OneGodian Galaxy™ planetary registry and world-building archive.', features: ['Planet cards', 'Canon records', 'Realm summaries', 'Expansion map'], checklist: ['Planet route live', 'Planet data active', 'Detail pages pending'] },
  { title: 'Products', slug: 'products', route: '/products', category: 'Commerce Layer', productionStatus: 'In Development', priority: 'High', iconKey: 'shopping-bag', description: 'Digital products, books, downloads, templates, and commercial offerings.', features: ['Product cards', 'Store handoff', 'Digital downloads', 'Featured products'], checklist: ['Product route active', 'Commerce integration pending'] },
  { title: 'Certificates', slug: 'certificates', route: '/certificates', category: 'Verification Layer', productionStatus: 'In Development', priority: 'Medium', iconKey: 'badge-check', description: 'Certificates, badges, identity records, proof objects, and verification documents.', features: ['Certificate cards', 'Badge records', 'Proof objects', 'Verification links'], checklist: ['Certificate shell active', 'QR verification pending'] },
  { title: 'Profile', slug: 'profile', route: '/profile', category: 'User Layer', productionStatus: 'Planned', priority: 'Medium', iconKey: 'user', description: 'User identity, access level, member status, preferences, and saved activity.', features: ['Profile', 'Access level', 'Saved records', 'Member identity'], checklist: ['Profile route pending', 'Auth pending'] }
];
