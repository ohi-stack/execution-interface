import { routes } from './omos-pages';
import { tools } from './tools';
import { ecosystemLinks } from './ecosystem';
import { capitalProducts, qrvNetwork } from './capital-products';
export const manifest = { siteName: 'OMOS.OneGodian.com', version: '1.1.0', domain: 'OMOS.OneGodian.com', routes, modules: tools.map((tool) => tool.title), ecosystemLinks, capitalProducts, qrvNetwork };
