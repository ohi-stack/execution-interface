import { routes } from './omos-pages';
import { tools } from './tools';
import { ecosystemLinks } from './ecosystem';
export const manifest = { siteName: 'OMOS.OneGodian.com', version: '1.0.0', domain: 'OMOS.OneGodian.com', routes, modules: tools.map((tool) => tool.title), ecosystemLinks };
