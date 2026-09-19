import { routes } from './omos-pages';
import { tools } from './tools';
import { ecosystemLinks } from './ecosystem';
import { ecosystemCorePages, ECOSYSTEM_CORE_PAGE_TOTAL, ECOSYSTEM_REGISTRY_UPDATED_AT, TRACKED_PLATFORM_COUNT } from './ecosystem-core-pages';
import { appPageRegistry, APP_CORE_PAGE_COUNT } from './app-pages';
import { capitalProducts, qrvNetwork } from './capital-products';
import { adminRoutes, dashboardRoutes, publicNavigation, roles, runtimeStatus, settingsGroups } from './platform';

export const manifest = {
  siteName: 'OneGodian App',
  version: runtimeStatus.manifestVersion,
  domain: 'app.onegodian.com',
  canonicalUrl: 'https://app.onegodian.com',
  registryUpdatedAt: ECOSYSTEM_REGISTRY_UPDATED_AT,
  modes: ['public website bridge', 'member dashboard', 'restricted administration panel'],
  publicNavigation,
  dashboardRoutes,
  adminRoutes,
  roles,
  settingsGroups,
  routes,
  appPageRegistry,
  appCorePageCount: APP_CORE_PAGE_COUNT,
  ecosystem: {
    trackedPlatforms: TRACKED_PLATFORM_COUNT,
    corePageTotal: ECOSYSTEM_CORE_PAGE_TOTAL,
    platforms: ecosystemCorePages,
  },
  modules: tools.map((tool) => tool.title),
  orchestration: {
    defaultMode: 'production',
    modes: {
      production: 'Secure synchronization and orchestration for WordPress, dashboards, APIs, and background jobs.',
      maintenance: 'Read-only operational mode for maintenance windows and reconciliation.',
    },
    adapters: ['WordPress', 'OneGodian Platform Plugin', 'PostgreSQL', 'Redis BullMQ'],
  },
  ecosystemLinks,
  capitalProducts,
  qrvNetwork,
  utcTruth: true,
  civilDatesLegallyControlling: true,
};
