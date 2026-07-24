import { routes } from './omos-pages';
import { tools } from './tools';
import { ecosystemLinks } from './ecosystem';
import { capitalProducts, qrvNetwork } from './capital-products';
import { adminRoutes, dashboardRoutes, publicNavigation, roles, runtimeStatus, settingsGroups } from './platform';

export const manifest = {
  siteName: 'INO Platform Sync Node',
  version: runtimeStatus.manifestVersion,
  domain: 'app.indigenousnations.org',
  modes: ['public website bridge', 'member dashboard', 'restricted administration panel'],
  publicNavigation,
  dashboardRoutes,
  adminRoutes,
  roles,
  settingsGroups,
  routes,
  modules: tools.map((tool) => tool.title),
  orchestration: {
    defaultMode: 'production',
    modes: {
      production: 'Secure synchronization and orchestration for WordPress, dashboards, APIs, and background jobs.',
      maintenance: 'Read-only operational mode for maintenance windows and reconciliation.',
    },
    adapters: ['WordPress', 'INO Platform Plugin', 'PostgreSQL', 'Redis BullMQ'],
  },
  ecosystemLinks,
  capitalProducts,
  qrvNetwork,
  utcTruth: true,
  civilDatesLegallyControlling: true,
};
