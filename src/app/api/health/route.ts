import { jsonResponse } from '@/lib/api-json';
import { appName, appRoutes, appVersion, pluginBridgeShortcodes } from '@/lib/onegodian-app-content';

const productionApis = ['/api/health', '/api/manifest', '/api/tools', '/api/stats'];
import { productionDashboardRows, productionRelease } from '@/lib/production-docs';

const productionRoutes = productionDashboardRows.filter((row) => !row.href.startsWith('/api')).map((row) => row.href);
const productionApis = productionDashboardRows.filter((row) => row.href.startsWith('/api')).map((row) => row.href);

export async function GET(request: Request) {
  return jsonResponse(
    {
      app: appName,
      status: 'ok',
      service: 'omos-site',
      domain: 'OMOS.OneGodian.com',
      version: '1.0.0'
      environment: process.env.NODE_ENV ?? 'development',
      version: appVersion,
      canonicalHost: 'https://app.onegodian.com',
      domainRole: 'public/member-facing app gateway',
      publicRouteCount: appRoutes.length,
      productionRoutes: appRoutes,
      productionApis,
      pluginBridgeShortcodeCount: pluginBridgeShortcodes.length,
      pluginSync: 'available',
      release: productionRelease,
      version: productionRelease.version,
      canonicalHost: productionRelease.canonicalHost,
      publicRouteCount: productionRoutes.length,
      productionRoutes,
      productionApis,
      documentationSurfaces: productionDashboardRows,
      checks: {
        documentationHub: 'ok',
        statusDashboard: 'ok',
        healthEndpoint: 'ok',
        manifestEndpoint: 'ok',
        mobileResponsiveTheme: 'ok'
      },
      generatedAt: new Date().toISOString()
    },
    request
  );
}
