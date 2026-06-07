import { jsonResponse } from '@/lib/api-json';
import { manifest } from '@/data/manifest';

export async function GET(request: Request) {
  return jsonResponse(manifest, request);
import { getCapitalBridgeStatus } from '@/lib/bridges/capital';
import { getMembersBridgeStatus } from '@/lib/bridges/members';
import { getPlatformBridgeStatus } from '@/lib/bridges/platform';
import { productionDashboardRows, productionDocPages, productionRelease } from '@/lib/production-docs';

const productionRoutes = productionDashboardRows.filter((row) => !row.href.startsWith('/api')).map((row) => row.href);
const productionApis = productionDashboardRows.filter((row) => row.href.startsWith('/api')).map((row) => row.href);

export async function GET(request: Request) {
  return jsonResponse(
    {
      ...runtimeManifest,
      app: appPages.app,
      ecosystem: ecosystemManifest,
      generated_at: new Date().toISOString(),
      app_profile: 'member-facing-app',
      release: productionRelease,
      canonicalHost: productionRelease.canonicalHost,
      productionRoutes,
      productionApis,
      documentation: {
        hub: '/docs',
        statusDashboard: '/status',
        pages: productionDocPages.map(({ eyebrow, href, title, description }) => ({ eyebrow, href, title, description })),
        surfaces: productionDashboardRows
      },
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
