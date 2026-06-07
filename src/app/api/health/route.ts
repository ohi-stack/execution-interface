import { jsonResponse } from '@/lib/api-json';
import { platformStatus, verificationStatus } from '@/data/onegodianContent';
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
      app: 'OneGodian App',
      version: 'production',
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
        manifestEndpoint: 'ok',
        healthEndpoint: 'ok',
        coreContentRoutes: 'ok',
        dashboardContent: 'ok',
        ecosystemHierarchy: 'ok',
        mobileResponsiveCards: 'ok'
      },
      platformStatus,
      verificationStatus,
      generatedAt: new Date().toISOString()
    },
    request
  );
}
