import runtimeManifest from '@/data/manifest.json';
import appPages from '@/data/app-pages.json';
import ecosystemManifest from '@/data/ecosystem-manifest.json';
import { jsonResponse } from '@/lib/api-json';
import { getCapitalBridgeStatus } from '@/lib/bridges/capital';
import { getMembersBridgeStatus } from '@/lib/bridges/members';
import { getPlatformBridgeStatus } from '@/lib/bridges/platform';
import { appDomainRole, appName, appRoutes, appVersion, dashboardModules, pluginBridgeShortcodes, productionDomainRoles } from '@/lib/onegodian-app-content';

const productionApis = ['/api/health', '/api/manifest', '/api/tools', '/api/stats'];

export async function GET(request: Request) {
  return jsonResponse(
    {
      ...runtimeManifest,
      app_name: appName,
      appName,
      version: appVersion,
      app: appPages.app,
      domain_role: appDomainRole,
      canonicalHost: 'https://app.onegodian.com',
      modules: dashboardModules,
      routes: appRoutes,
      productionApis,
      wordpress_plugin_bridge_shortcodes: pluginBridgeShortcodes,
      domainRoles: productionDomainRoles,
      compliance: {
        org: 'onegodian.org is for identity, education, community, and documentation.',
        com: 'onegodian.com is for commerce, products, services, and payments.',
        contributions: 'app.onegodian.com does not process contributions directly unless a payment backend exists.',
        contributorNotice: 'Contributions are voluntary support payments and are not equity, securities, loans, bonds, investment contracts, or promises of financial return.'
      },
      ecosystem: ecosystemManifest,
      generated_at: new Date().toISOString(),
      bridges: [getPlatformBridgeStatus(), getMembersBridgeStatus(), getCapitalBridgeStatus()],
      pluginSync: {
        endpoints: ['/api/plugin-consumers', '/api/plugin-shortcodes', '/api/plugin-sync'],
        consumers: ['OneGodian.com', 'OneGodian.org', 'QuantumOHI.com'],
        wordpress: {
          environment: 'WORDPRESS_API_URL',
          authentication: 'X-OMOS-App-Key / OMOS_APP_KEY'
        }
      }
    },
    request
  );
}
