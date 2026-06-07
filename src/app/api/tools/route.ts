import { jsonResponse } from '@/lib/api-json';
import { affiliateDashboardItems, dashboardModules, membershipShortcodeMap, pluginBridgeShortcodes } from '@/lib/onegodian-app-content';

export async function GET(request: Request) {
  return jsonResponse(
    {
      status: 'ok',
      tools: dashboardModules.map((module) => ({ name: module.title, route: module.route, status: module.status, description: module.description })),
      membershipBridge: membershipShortcodeMap,
      affiliateDashboard: affiliateDashboardItems,
      wordpressPluginBridgeShortcodes: pluginBridgeShortcodes,
      compliance: 'Tools do not process contributions or payments directly unless a payment backend exists.'
    },
    request
  );
}
