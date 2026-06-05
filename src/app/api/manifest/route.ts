import runtimeManifest from '@/data/manifest.json';
import appPages from '@/data/app-pages.json';
import ecosystemManifest from '@/data/ecosystem-manifest.json';
import { jsonResponse } from '@/lib/api-json';
import { getCapitalBridgeStatus } from '@/lib/bridges/capital';
import { getMembersBridgeStatus } from '@/lib/bridges/members';
import { getPlatformBridgeStatus } from '@/lib/bridges/platform';

const productionRoutes = ['/dashboard', '/ecosystem', '/registry', '/members', '/products', '/media', '/capital', '/omos', '/learning'];
const productionApis = ['/api/health', '/api/manifest', '/api/tools', '/api/stats'];

export async function GET(request: Request) {
  return jsonResponse(
    {
      ...runtimeManifest,
      app: appPages.app,
      ecosystem: ecosystemManifest,
      generated_at: new Date().toISOString(),
      app_profile: 'member-facing-app',
      canonicalHost: 'https://app.onegodian.com',
      productionRoutes,
      productionApis,
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
