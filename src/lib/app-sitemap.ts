import { routeStatusRows } from '@/lib/app-content';

export type AppRouteNode = {
  title: string;
  path: string;
  group: string;
  description: string;
  status: 'active' | 'planned';
  children?: AppRouteNode[];
};

export const appSitemap: AppRouteNode[] = routeStatusRows.map((route) => ({
  title: route.title,
  path: route.path,
  group: route.path === '/' || route.path === '/status' ? 'Core' : 'Production Content',
  description: route.purpose,
  status: 'active'
}));
export const appSitemap: AppRouteNode[] = [
  { title: 'Home', path: '/', group: 'Core', description: 'OneGodian App public entry.', status: 'active' },
  { title: 'Dashboard', path: '/dashboard', group: 'Core', description: 'Central access dashboard.', status: 'active' },
  { title: 'Members', path: '/members', group: 'Member Infrastructure', description: 'Member profile, status, digital ID, certificate records, and community tools.', status: 'active' },
  { title: 'Campaigns', path: '/campaigns', group: 'Campaigns', description: 'Active campaigns, contribution drives, and public outreach resources.', status: 'active', children: [
    { title: 'Remember Campaign', path: '/campaigns/remember', group: 'Campaigns', description: 'OneGodian Remember Campaign landing page.', status: 'active' }
  ] },
  { title: 'Registry', path: '/registry', group: 'Records', description: 'ODIN records, verification entries, certificates, filings, and system records.', status: 'active' },
  { title: 'Tools', path: '/tools', group: 'Tools', description: 'Utilities, forms, calculators, onboarding tools, conversion tools, and internal resources.', status: 'active' },
  { title: 'Media', path: '/media', group: 'Media', description: 'Videos, music, publications, campaign media, and visual assets.', status: 'active' },
  { title: 'Learning', path: '/learn', group: 'Learning', description: 'Education pathways, onboarding, course links, and certification materials.', status: 'active' },
  { title: 'Certificates', path: '/certificates', group: 'Records', description: 'Certificate viewing, requests, verification, and digital credentials.', status: 'active' },
  { title: 'Support', path: '/support', group: 'Support', description: 'Contribution pathways for infrastructure, publishing, systems, media, and community tools.', status: 'active' },
  { title: 'Settings', path: '/settings', group: 'Account', description: 'App preferences, module defaults, and notifications.', status: 'active' },
  { title: 'Account', path: '/account', group: 'Account', description: 'Account profile and access preferences.', status: 'active' }
];
