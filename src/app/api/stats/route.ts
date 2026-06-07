import { jsonResponse } from '@/lib/api-json';
import appPages from '@/data/app-pages.json';
import tools from '@/data/tools.json';
import { getCapitalBridgeStatus } from '@/lib/bridges/capital';
import { getMembersBridgeStatus } from '@/lib/bridges/members';
import { getPlatformBridgeStatus } from '@/lib/bridges/platform';

const productionRoutes = ['/dashboard', '/ecosystem', '/omos', '/registry', '/tools', '/members', '/certificates', '/products', '/media', '/settings', '/docs'];
const productionApis = ['/api/health', '/api/manifest', '/api/tools', '/api/stats'];

export async function GET(request: Request) {
  return jsonResponse(
    {
      app: 'The OneGodian App',
      healthy: true,
      canonicalHost: 'https://app.onegodian.com',
      generatedAt: new Date().toISOString(),
      stats: {
        productionRouteCount: productionRoutes.length,
        productionApiCount: productionApis.length,
        navigationItems: appPages.navigation.length,
        toolCount: Array.isArray(tools.tools) ? tools.tools.length : 0,
        bridgeCount: 3
      },
      routeStatus: Object.fromEntries(productionRoutes.map((route) => [route, 'active'])),
      apiStatus: Object.fromEntries(productionApis.map((route) => [route, 'active'])),
      bridgeStatus: [getPlatformBridgeStatus(), getMembersBridgeStatus(), getCapitalBridgeStatus()]
    },
    request
  );
}
