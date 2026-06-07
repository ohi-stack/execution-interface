import { jsonResponse } from '@/lib/api-json';
import { registryContent, learningContent, omosContent, capitalContent } from '@/data/onegodianContent';
import { affiliateDashboardItems, dashboardModules, membershipShortcodeMap, pluginBridgeShortcodes } from '@/lib/onegodian-app-content';
import { tools } from '@/data/tools';

export async function GET(request: Request) {
  const tools = [registryContent, learningContent, omosContent, capitalContent].flatMap((route) =>
    route.cards.map((card) => ({ name: card.title, description: card.description, status: card.status, href: card.href }))
  );

  return jsonResponse(
    {
      status: 'ok',
      app: 'OneGodian App',
      toolCount: tools.length,
      tools: dashboardModules.map((module) => ({ name: module.title, route: module.route, status: module.status, description: module.description })),
      membershipBridge: membershipShortcodeMap,
      affiliateDashboard: affiliateDashboardItems,
      wordpressPluginBridgeShortcodes: pluginBridgeShortcodes,
      compliance: 'Tools do not process contributions or payments directly unless a payment backend exists.'
      service: 'omos-site',
      tools
    },
    request
  );
}
