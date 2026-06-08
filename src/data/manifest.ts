import { navigation } from './navigation';
import { statusModules } from './status';
import { tools } from './tools';

export const omosRoutes = navigation.map((item) => item.href);

export const ecosystemLinks = [
  { name: 'OMOS.OneGodian.com', role: 'Systems architecture and protocol platform', href: 'https://omos.onegodian.com' },
  { name: 'app.OneGodian.com', role: 'Operational application layer', href: 'https://app.onegodian.com/omos' },
  { name: 'OneGodian.org', role: 'Identity, education, and public record', href: 'https://onegodian.org' },
  { name: 'OneGodian.com', role: 'Commercial products and services', href: 'https://onegodian.com' },
  { name: 'QuantumOHI.com', role: 'OHI research and synthesis platform', href: 'https://quantumohi.com' },
  { name: 'QRV.Network', role: 'Network and verification infrastructure', href: 'https://qrv.network' }
];

export const manifest = {
  name: 'OneGodian Metaphysical Operating System',
  shortName: 'OMOS',
  domain: 'OMOS.OneGodian.com',
  service: 'omos-site',
  version: '1.0.0',
  routes: omosRoutes,
  apiRoutes: ['/api/health', '/api/manifest', '/api/tools', '/api/stats'],
  modules: statusModules.map((item) => ({ name: item.module, status: item.status, readiness: item.readiness })),
  tools: tools.map((tool) => tool.name),
  ecosystemLinks
};
