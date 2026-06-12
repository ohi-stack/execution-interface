import { appJson } from '@/lib/api';
import { dashboardModules, domainStructure, pluginShortcodes, tools } from '@/lib/acc-content';

export const dynamic = 'force-dynamic';

export function GET() {
  return appJson({
    stats: {
      modules: dashboardModules.length,
      routes: dashboardModules.length + 2,
      domains: domainStructure.length,
      pluginBridgeShortcodes: pluginShortcodes.length,
      tools: tools.length
    }
  });
}
