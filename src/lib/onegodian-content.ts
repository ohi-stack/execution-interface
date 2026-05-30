import { appDashboardCards, appFooterBoundary, appHomeHero, appNavigation, ecosystemPortals } from '@/lib/app-content';
import { consoleDashboardCards, consoleFooterBoundary, consoleNavigation } from '@/lib/console-content';

export const appMeta = appHomeHero;
export { appNavigation, consoleNavigation, ecosystemPortals };

export const ecosystemLinks = [
  { label: 'OneGodian.org', href: 'https://onegodian.org' },
  { label: 'OneGodian.com', href: 'https://onegodian.com' },
  { label: 'u.OneGodian.com', href: 'https://u.onegodian.com' },
  { label: 'Galaxy OneGodian', href: 'https://galaxy.onegodian.com' },
  { label: 'app.OneGodian.com', href: 'https://app.onegodian.com' },
  { label: 'OMOS OneGodian', href: 'https://omos.onegodian.com' },
  { label: 'QuantumOHI.com', href: 'https://quantumohi.com' },
  { label: 'QRV.Network', href: 'https://qrv.network' }
];

export const dashboardCards = appDashboardCards;
export { appDashboardCards, consoleDashboardCards };

export const appStructureLayers = ['Public App', 'Member Dashboard', 'Membership', 'Certificates', 'Campaigns', 'Media', 'Products', 'Learning', 'Tools', 'Profile'];

export const coreRoutes = ['/', '/dashboard', '/ecosystem', '/omos', '/remember', '/membership', '/time', '/commerce', '/institutional', '/api/manifest'];

export const footerSections = [
  { title: 'OneGodian App', links: [{ label: 'Dashboard', href: '/dashboard' }, { label: 'Ecosystem', href: '/ecosystem' }, { label: 'Remember', href: '/remember' }, { label: 'Membership', href: '/membership' }] },
  { title: 'Ecosystem', links: [{ label: 'OneGodian.org', href: 'https://onegodian.org' }, { label: 'OneGodian.com', href: 'https://onegodian.com' }, { label: 'U OneGodian', href: 'https://u.onegodian.com' }, { label: 'QRV Network', href: 'https://qrv.network' }] },
  { title: 'Operations', links: [{ label: 'OMOS', href: '/omos' }, { label: 'Time', href: '/time' }, { label: 'Commerce', href: '/commerce' }, { label: 'Institutional', href: '/institutional' }] }
];

export const systemsModel = [
  { title: 'App Experience', items: ['Dashboard', 'Ecosystem', 'Membership', 'Certificates'] },
  { title: 'Content & Commerce', items: ['Campaigns', 'Media', 'Products', 'Learning'] },
  { title: 'Account', items: ['Tools', 'Profile', 'Settings'] }
];

export const apiStatus = { app: 'OneGodian App', appUrl: 'https://app.onegodian.com', consoleUrl: 'https://console.onegodian.com', environment: 'Production', currentDateRecord: 'May 23, 2026' };
export const appStatus = { ...apiStatus, store: 'https://onegodian.com', publicSite: 'https://onegodian.org', api: 'https://app.onegodian.com/api/health', activeCampaign: 'THE ONEGODIAN: Remember Campaign' };
export const appBoundaryCopy = appFooterBoundary;
export const consoleBoundaryCopy = consoleFooterBoundary;

export const pluginCategories = [
  { title: 'Core Platform Plugins', plugins: ['OneGodian Platform Plugin', 'OneGodian App Bridge Plugin', 'OneGodian Members Plugin', 'OneGodian Certificates Plugin', 'OneGodian Registry Plugin'] }
];

export const rememberCampaign = {
  officialStartDate: 'May 9, 2026',
  onegodianDate: 'Wisdom 23, OT 0001',
  message: 'You were always One — you simply forgot. Remember who you are.',
  purpose: 'A public-facing awareness campaign centered on remembrance, identity, unity, origin, and shared human connection.',
  dashboardFunctions: ['Campaign overview', 'Campaign media', 'Store product links', 'Creator resources', 'Member participation tools', 'Social captions', 'Campaign status']
};
