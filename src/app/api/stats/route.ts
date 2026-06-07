import { jsonResponse } from '@/lib/api-json';
import tools from '@/data/tools.json';
import { getCapitalBridgeStatus } from '@/lib/bridges/capital';
import { getMembersBridgeStatus } from '@/lib/bridges/members';
import { getPlatformBridgeStatus } from '@/lib/bridges/platform';
import { appName, appRoutes, dashboardModules, pluginBridgeShortcodes } from '@/lib/onegodian-app-content';

const productionApis = ['/api/health', '/api/manifest', '/api/tools', '/api/stats'];
import { omosRoutes } from '@/data/manifest';
import { statusSummary } from '@/data/status';
import { tools } from '@/data/tools';

export async function GET(request: Request) {
  return jsonResponse(
    {
      app: appName,
      healthy: true,
      canonicalHost: 'https://app.onegodian.com',
      domainRole: 'public/member-facing app gateway',
      generatedAt: new Date().toISOString(),
      stats: {
        productionRouteCount: appRoutes.length,
        productionApiCount: productionApis.length,
        moduleCount: dashboardModules.length,
        toolCount: Array.isArray(tools.tools) ? tools.tools.length : 0,
        bridgeShortcodeCount: pluginBridgeShortcodes.length,
        bridgeCount: 3
      },
      routeStatus: Object.fromEntries(appRoutes.map((route) => [route, 'active'])),
      apiStatus: Object.fromEntries(productionApis.map((route) => [route, 'active'])),
      bridgeStatus: [getPlatformBridgeStatus(), getMembersBridgeStatus(), getCapitalBridgeStatus()]
      status: 'ok',
      service: 'omos-site',
      moduleCount: statusSummary.active + statusSummary.ready + statusSummary.needsWork,
      routeCount: omosRoutes.length,
      toolCount: tools.length,
      statusSummary
    },
    request
  );
}
