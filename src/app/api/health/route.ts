import { jsonResponse } from '@/lib/api-json';
import { productionDashboardRows, productionRelease } from '@/lib/production-docs';

const productionRoutes = productionDashboardRows.filter((row) => !row.href.startsWith('/api')).map((row) => row.href);
const productionApis = productionDashboardRows.filter((row) => row.href.startsWith('/api')).map((row) => row.href);

export async function GET(request: Request) {
  return jsonResponse(
    {
      app: 'The OneGodian App',
      status: 'ok',
      environment: process.env.NODE_ENV ?? 'development',
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
