export type AppRouteNode = {
  title: string;
  path: string;
  group: string;
  description: string;
  status: 'active' | 'planned';
  children?: AppRouteNode[];
};

export const appSitemap: AppRouteNode[] = [
  { title: 'Home', path: '/', group: 'Core', description: 'OneGodian App public/member landing.', status: 'active' },
  { title: 'Dashboard', path: '/dashboard', group: 'Core', description: 'Public/member-facing dashboard.', status: 'active' },
  { title: 'Sitemap', path: '/sitemap', group: 'Core', description: 'Public route map for app.onegodian.com.', status: 'active' },
  { title: 'Systems Model', path: '/systems-model', group: 'Core', description: 'Public systems model.', status: 'active' },
  { title: 'Ecosystem', path: '/ecosystem', group: 'Core', description: 'OneGodian ecosystem portals.', status: 'active' },
  { title: 'Apps', path: '/apps', group: 'Core', description: 'Application node index.', status: 'active' },
  { title: 'Plugins', path: '/plugins', group: 'Core', description: 'Plugin inventory and status.', status: 'active' },
  { title: 'API Status', path: '/api-status', group: 'Operations', description: 'App API status snapshot.', status: 'active' },
  { title: 'System Health', path: '/system-health', group: 'Operations', description: 'App + OMOS health dashboard.', status: 'active' },
  {
    title: 'OMOS', path: '/omos', group: 'OMOS', description: 'OMOS protocol/runtime public dashboard.', status: 'active', children: [
      { title: 'Manifest', path: '/omos/manifest', group: 'OMOS', description: 'Manifest view sourced via app APIs.', status: 'active' },
      { title: 'Pages', path: '/omos/pages', group: 'OMOS', description: 'Synced page registry from OMOS.', status: 'active' },
      { title: 'Health', path: '/omos/health', group: 'OMOS', description: 'OMOS health endpoint status.', status: 'active' },
      { title: 'Sync', path: '/omos/sync', group: 'OMOS', description: 'OMOS sync telemetry from app API.', status: 'active' },
      { title: 'Plugins', path: '/omos/plugins', group: 'OMOS', description: 'OMOS plugin state from sync APIs.', status: 'active' },
      { title: 'Properties', path: '/omos/properties', group: 'OMOS', description: 'OMOS property dataset from sync APIs.', status: 'active' }
    ]
  },
  {
    title: 'Architecture', path: '/architecture', group: 'Architecture', description: 'Architecture overview for public app node.', status: 'active', children: [
      { title: 'OHI', path: '/architecture/ohi', group: 'Architecture', description: 'OHI layer role.', status: 'active' },
      { title: 'Runtime', path: '/architecture/runtime', group: 'Architecture', description: 'Runtime model.', status: 'active' },
      { title: 'Interfaces', path: '/architecture/interfaces', group: 'Architecture', description: 'Public/member interface boundaries.', status: 'active' },
      { title: 'Infrastructure', path: '/architecture/infrastructure', group: 'Architecture', description: 'Infrastructure concerns.', status: 'active' },
      { title: 'OMOS Sync', path: '/architecture/omos-sync', group: 'Architecture', description: 'OMOS sync pathway.', status: 'active' }
    ]
  },
  {
    title: 'Algorithm', path: '/algorithm', group: 'Algorithm', description: 'OneGodian algorithm overview.', status: 'active', children: [
      { title: 'Protocol', path: '/algorithm/protocol', group: 'Algorithm', description: 'Protocol perspective.', status: 'active' },
      { title: 'Experience', path: '/algorithm/experience', group: 'Algorithm', description: 'Experience layer.', status: 'active' },
      { title: 'Community', path: '/algorithm/community', group: 'Algorithm', description: 'Community layer.', status: 'active' },
      { title: 'Orientation', path: '/algorithm/orientation', group: 'Algorithm', description: 'Orientation layer.', status: 'active' }
    ]
  },
  { title: 'Registry', path: '/registry', group: 'Core', description: 'Public/member registry surface.', status: 'active' },
  { title: 'Time', path: '/time', group: 'Core', description: 'OneGodian Time tools.', status: 'active' },
  { title: 'Portfolio', path: '/portfolio', group: 'Core', description: 'Public portfolio snapshot.', status: 'active' },
  { title: 'Records', path: '/records', group: 'Core', description: 'Public/member record index.', status: 'active' },
  { title: 'Tools', path: '/tools', group: 'Core', description: 'Public tools collection.', status: 'active' }
];
