import {
  appDashboardCards,
  appFooterBoundary,
  appHomeHero,
  appNavigation,
  coreRoutes,
  ecosystemPortals,
  footerSections,
  rememberCampaign,
  routeStatusRows,
  systemsModel,
  apiStatus,
  appStatus,
  pluginCategories
} from '@/lib/app-content';
import { consoleDashboardCards, consoleFooterBoundary, consoleNavigation } from '@/lib/console-content';

export const appMeta = appHomeHero;
export const dashboardCards = appDashboardCards;
export const ecosystemLinks = ecosystemPortals.map((portal) => ({ label: portal.name, href: portal.url }));
export const appBoundaryCopy = appFooterBoundary;
export const consoleBoundaryCopy = consoleFooterBoundary;

export {
  appDashboardCards,
  appFooterBoundary,
  appHomeHero,
  appNavigation,
  consoleDashboardCards,
  consoleNavigation,
  coreRoutes,
  ecosystemPortals,
  footerSections,
  rememberCampaign,
  routeStatusRows,
  systemsModel,
  apiStatus,
  appStatus,
  pluginCategories
};

export const appStructureLayers = ['Public Dashboard', 'Ecosystem', 'Overview', 'OMOS', 'Algorithm', 'Time', 'Commerce', 'Identity', 'Remember', 'Status'];
