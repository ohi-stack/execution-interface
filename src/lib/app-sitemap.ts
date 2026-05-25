export type SitemapStatus = 'live' | 'planned' | 'internal' | 'external';

export type SitemapItem = {
  title: string;
  path: string;
  group: string;
  description: string;
  status: SitemapStatus;
  children?: SitemapItem[];
};

export const appSitemap: SitemapItem[] = [
  { title: 'Dashboard', path: '/dashboard', group: 'Dashboard', description: 'Public/member operational dashboard with runtime and ecosystem cards.', status: 'live' },
  { title: 'Systems Model', path: '/systems', group: 'Systems Model', description: 'System model and platform view for app-facing users.', status: 'live' },
  { title: 'OMOS', path: '/omos', group: 'OMOS', description: 'OMOS runtime/sync status surface powered by app APIs.', status: 'live', children: [
    { title: 'Manifest', path: '/omos/manifest', group: 'OMOS', description: 'Current OMOS manifest snapshot from app sync cache.', status: 'live' },
    { title: 'Pages', path: '/omos/pages', group: 'OMOS', description: 'OMOS page registry currently synchronized to app cache.', status: 'live' },
    { title: 'Health', path: '/omos/health', group: 'OMOS', description: 'OMOS upstream health and app-facing health summary.', status: 'live' },
    { title: 'Sync', path: '/omos/sync', group: 'OMOS', description: 'Raw sync payload and last synchronization telemetry.', status: 'live' },
    { title: 'Plugins', path: '/omos/plugins', group: 'OMOS', description: 'Public plugin registry snapshot for OMOS integrations.', status: 'live' },
    { title: 'Properties', path: '/omos/properties', group: 'OMOS', description: 'Public property registry snapshot for OMOS integrations.', status: 'live' }
  ] },
  { title: 'Architecture', path: '/architecture', group: 'Architecture', description: 'OHI multi-layer architecture map and implementation notes.', status: 'live', children: [
    { title: 'OMOS Sync Flow', path: '/architecture/omos-sync', group: 'Architecture', description: 'Data flow from OMOS endpoints to app APIs and widgets.', status: 'live' }
  ] },
  { title: 'Algorithm', path: '/algorithm', group: 'Algorithm', description: 'Algorithm orientation, protocol, and community pages.', status: 'live' },
  { title: 'OHI', path: '/ohi', group: 'OHI', description: 'OneGodian Human Interface (OHI) framing and public posture.', status: 'live' },
  { title: 'Registry', path: '/registry', group: 'Registry', description: 'Registry views and references for public app participants.', status: 'live' },
  { title: 'Time', path: '/time', group: 'Time', description: 'OneGodian time pages including dual dating context.', status: 'live' },
  { title: 'Portfolio', path: '/portfolio', group: 'Portfolio', description: 'Portfolio hub for member/public roadmap output.', status: 'planned' },
  { title: 'Records', path: '/records', group: 'Records', description: 'Records hub for historical and canonical documentation.', status: 'planned' },
  { title: 'Institutional', path: '/ecosystem', group: 'Institutional', description: 'Institutional ecosystem entry points and boundaries.', status: 'live' },
  { title: 'Tools', path: '/tools', group: 'Tools', description: 'Tooling pages, utilities, and app-side module surfaces.', status: 'live' },
  { title: 'Products', path: '/store', group: 'Products', description: 'Public product/store-facing app route.', status: 'live' },
  { title: 'Campaigns', path: '/campaigns', group: 'Campaigns', description: 'Campaign pages and participation views.', status: 'live' },
  { title: 'Docs', path: '/docs', group: 'Docs', description: 'Public-facing docs and standards pages.', status: 'live' },
  { title: 'Legal', path: '/legal', group: 'Legal', description: 'Legal and policy references for the app.', status: 'planned' },
  { title: 'OMOS External Site', path: 'https://omos.onegodian.com', group: 'OMOS', description: 'External OMOS source domain for manifest/health/pages.', status: 'external' }
];
