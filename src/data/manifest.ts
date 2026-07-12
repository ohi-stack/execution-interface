import { routes } from './omos-pages';
import { tools } from './tools';
import { ecosystemLinks } from './ecosystem';
import { capitalProducts, qrvNetwork } from './capital-products';
import { adminRoutes, dashboardRoutes, publicNavigation, roles, runtimeStatus, settingsGroups } from './platform';
export const manifest = { siteName: 'OMOS.OneGodian.com', version: runtimeStatus.manifestVersion, domain: 'OMOS.OneGodian.com', modes: ['public website','developer console','restricted administration panel'], publicNavigation, dashboardRoutes, adminRoutes, roles, settingsGroups, routes, modules: tools.map((tool) => tool.title), ecosystemLinks, capitalProducts, qrvNetwork, utcTruth: true, civilDatesLegallyControlling: true };
