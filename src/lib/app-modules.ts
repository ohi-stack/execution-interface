export type ProductionStatus = 'Live' | 'Demo Ready' | 'Staging' | 'In Development' | 'Needs Setup' | 'Planned' | 'Offline';
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
  { title: 'Dashboard', slug: 'dashboard', route: '/dashboard', category: 'Command Hub', description: 'Central operations.', productionStatus: 'Live', priority: 'Critical', iconKey: 'layout-dashboard', features: ['Overview'], checklist: ['Live'] },
  { title: 'Ecosystem', slug: 'ecosystem', route: '/ecosystem', category: 'Directory', description: 'Platform directory.', productionStatus: 'Live', priority: 'Critical', iconKey: 'network', features: ['Directory'], checklist: ['Live'] },
  { title: 'Registry', slug: 'registry', route: '/registry', category: 'ODIN', description: 'Records and validation.', productionStatus: 'In Development', priority: 'High', iconKey: 'database', features: ['Records'], checklist: ['Build API sync'] },
  { title: 'Planets', slug: 'planets', route: '/planets', category: 'Canon', description: 'Planetary canon.', productionStatus: 'Live', priority: 'Medium', iconKey: 'orbit', features: ['Cards'], checklist: ['Live'] },
  { title: 'Tools', slug: 'tools', route: '/tools', category: 'Utilities', description: 'Operational tools.', productionStatus: 'In Development', priority: 'High', iconKey: 'wrench', features: ['Utilities'], checklist: ['Expand'] },
  { title: 'Media', slug: 'media', route: '/media', category: 'Media', description: 'Media center.', productionStatus: 'Live', priority: 'Medium', iconKey: 'image', features: ['Assets'], checklist: ['Live'] },
  { title: 'Capital', slug: 'capital', route: '/capital', category: 'Economic', description: 'Economic intelligence.', productionStatus: 'Staging', priority: 'High', iconKey: 'landmark', features: ['Metrics'], checklist: ['Refine'] },
  { title: 'OMOS', slug: 'omos', route: '/omos', category: 'Systems', description: 'OMOS plugin bridge dashboard and operations.', productionStatus: 'Staging', priority: 'Critical', iconKey: 'network', features: ['Bridge'], checklist: ['Configure OMOS env', 'Validate /api/omos/llm/chat'] }
];
