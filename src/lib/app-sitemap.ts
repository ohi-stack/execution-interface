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
  { title: 'OMOS', path: '/omos', group: 'OMOS', description: 'OMOS protocol/runtime public dashboard.', status: 'active' },
  { title: 'Remember', path: '/remember', group: 'Campaigns', description: 'OneGodian: Remember campaign page.', status: 'active' },
  { title: 'Membership', path: '/membership', group: 'Core', description: 'Membership entry route.', status: 'active' },
  { title: 'Time', path: '/time', group: 'Core', description: 'OneGodian Time tools.', status: 'active' },
  { title: 'Commerce', path: '/commerce', group: 'Core', description: 'OneGodian commerce and identity engine route.', status: 'active' },
  { title: 'Institutional', path: '/institutional', group: 'Core', description: 'Institutional clarity and legal boundary route.', status: 'active' },
  { title: 'Tools', path: '/tools', group: 'Control Plane', description: 'Planned tools operational layer.', status: 'planned' },
  { title: 'Certificates', path: '/certificates', group: 'Control Plane', description: 'Planned certificate operational layer.', status: 'planned' },
  { title: 'Registry', path: '/registry', group: 'Control Plane', description: 'Planned registry operational layer.', status: 'planned' },
  { title: 'Members', path: '/members', group: 'Control Plane', description: 'Planned member operational layer.', status: 'planned' },
  { title: 'Settings', path: '/settings', group: 'Control Plane', description: 'Planned settings operational layer.', status: 'planned' },
  { title: 'Admin', path: '/admin', group: 'Control Plane', description: 'Admin integration placeholder.', status: 'planned' }
];
