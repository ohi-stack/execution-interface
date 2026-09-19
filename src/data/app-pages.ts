export type AppPageClass = 'public' | 'dashboard' | 'admin' | 'api' | 'tool' | 'integration' | 'operations' | 'documentation';

export type AppPageRecord = {
  odin: string;
  title: string;
  path: string;
  pageClass: AppPageClass;
};

export const appPageRegistry: AppPageRecord[] = [
  { odin: 'ODIN-APP-0001', title: 'Home', path: '/', pageClass: 'public' },
  { odin: 'ODIN-APP-0002', title: 'Dashboard', path: '/dashboard', pageClass: 'dashboard' },
  { odin: 'ODIN-APP-0003', title: 'Ecosystem', path: '/ecosystem', pageClass: 'public' },
  { odin: 'ODIN-APP-0004', title: 'Registry', path: '/registry', pageClass: 'operations' },
  { odin: 'ODIN-APP-0005', title: 'Tools', path: '/tools', pageClass: 'tool' },
  { odin: 'ODIN-APP-0006', title: 'Members', path: '/members', pageClass: 'dashboard' },
  { odin: 'ODIN-APP-0007', title: 'Certificates', path: '/certificates', pageClass: 'dashboard' },
  { odin: 'ODIN-APP-0008', title: 'Products', path: '/products', pageClass: 'public' },
  { odin: 'ODIN-APP-0009', title: 'Media', path: '/media', pageClass: 'public' },
  { odin: 'ODIN-APP-0010', title: 'Settings', path: '/settings', pageClass: 'dashboard' },
  { odin: 'ODIN-APP-0011', title: 'Admin', path: '/admin', pageClass: 'admin' },
  { odin: 'ODIN-APP-0012', title: 'ACC', path: '/acc', pageClass: 'operations' },
  { odin: 'ODIN-APP-0013', title: 'Agent Console', path: '/agents', pageClass: 'operations' },
  { odin: 'ODIN-APP-0014', title: 'Workflows', path: '/workflows', pageClass: 'operations' },
  { odin: 'ODIN-APP-0015', title: 'Tasks', path: '/tasks', pageClass: 'operations' },
  { odin: 'ODIN-APP-0016', title: 'Forms', path: '/forms', pageClass: 'operations' },
  { odin: 'ODIN-APP-0017', title: 'Submissions', path: '/submissions', pageClass: 'operations' },
  { odin: 'ODIN-APP-0018', title: 'Notifications', path: '/notifications', pageClass: 'dashboard' },
  { odin: 'ODIN-APP-0019', title: 'Activity Feed', path: '/activity', pageClass: 'dashboard' },
  { odin: 'ODIN-APP-0020', title: 'Production Checklist', path: '/production-checklist', pageClass: 'operations' },
  { odin: 'ODIN-APP-0021', title: 'System Health', path: '/system-health', pageClass: 'operations' },
  { odin: 'ODIN-APP-0022', title: 'API Health', path: '/api/health', pageClass: 'api' },
  { odin: 'ODIN-APP-0023', title: 'Manifest', path: '/api/manifest', pageClass: 'api' },
  { odin: 'ODIN-APP-0024', title: 'Tools API', path: '/api/tools', pageClass: 'api' },
  { odin: 'ODIN-APP-0025', title: 'Stats API', path: '/api/stats', pageClass: 'api' },
  { odin: 'ODIN-APP-0026', title: 'OHI Runtime', path: '/ohi', pageClass: 'integration' },
  { odin: 'ODIN-APP-0027', title: 'OMOS', path: '/omos', pageClass: 'integration' },
  { odin: 'ODIN-APP-0028', title: 'OBP-1', path: '/obp-1', pageClass: 'integration' },
  { odin: 'ODIN-APP-0029', title: 'Time Tools', path: '/time', pageClass: 'tool' },
  { odin: 'ODIN-APP-0030', title: 'Belief Mapper', path: '/belief-mapper', pageClass: 'tool' },
  { odin: 'ODIN-APP-0031', title: 'Purpose Finder', path: '/purpose-finder', pageClass: 'tool' },
  { odin: 'ODIN-APP-0032', title: 'Content Manager', path: '/content-manager', pageClass: 'admin' },
  { odin: 'ODIN-APP-0033', title: 'Page Installer', path: '/page-installer', pageClass: 'admin' },
  { odin: 'ODIN-APP-0034', title: 'Plugin Registry', path: '/plugin-registry', pageClass: 'operations' },
  { odin: 'ODIN-APP-0035', title: 'Google Sync', path: '/google-sync', pageClass: 'integration' },
  { odin: 'ODIN-APP-0036', title: 'Gmail Notices', path: '/gmail-notices', pageClass: 'integration' },
  { odin: 'ODIN-APP-0037', title: 'Import / Export', path: '/import-export', pageClass: 'operations' },
  { odin: 'ODIN-APP-0038', title: 'Logs', path: '/logs', pageClass: 'operations' },
  { odin: 'ODIN-APP-0039', title: 'Documentation', path: '/documentation', pageClass: 'documentation' },
  { odin: 'ODIN-APP-0040', title: 'Portal', path: '/portal', pageClass: 'public' }
];

export const APP_CORE_PAGE_COUNT = appPageRegistry.length;
