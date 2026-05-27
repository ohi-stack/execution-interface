export type AppRouteNode = {
  title: string;
  path: string;
  group: string;
  description: string;
  status: 'active' | 'planned';
  children?: AppRouteNode[];
};

export const appSitemap: AppRouteNode[] = [
  { title: 'Home', path: '/', group: 'Core', description: 'OneGodian App public entry.', status: 'active' },
  { title: 'Dashboard', path: '/dashboard', group: 'Core', description: 'Public/member dashboard entry.', status: 'active' },
  { title: 'Ecosystem', path: '/ecosystem', group: 'Core', description: 'Domain ecosystem map and statuses.', status: 'active' },
  { title: 'OMOS', path: '/omos', group: 'Core', description: 'OMOS operating model and structure overview.', status: 'active' },
  { title: 'Remember', path: '/remember', group: 'Campaigns', description: 'OneGodian: Remember campaign page.', status: 'active' },
  { title: 'Membership', path: '/membership', group: 'Core', description: 'Membership pathways and dashboard entry.', status: 'active' },
  { title: 'Time', path: '/time', group: 'Core', description: 'OneGodian Time™ / OTS-V5 overview.', status: 'active' },
  { title: 'Commerce', path: '/commerce', group: 'Core', description: 'Commerce and identity product engine overview.', status: 'active' },
  { title: 'Institutional', path: '/institutional', group: 'Core', description: 'Institutional and legal clarity guidance.', status: 'active' }
];
