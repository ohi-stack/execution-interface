import { appDashboardCards } from '@/lib/app-content';
import { coreRoutes } from '@/lib/onegodian-content';
import { jsonResponse } from '@/lib/api-json';

export async function GET(request: Request) {
  return jsonResponse(
    {
      app: 'OneGodian App',
      purpose:
        'Central access layer for dashboards, identity systems, registries, ecosystem tools, operational interfaces, account systems, and member infrastructure.',
      modules: appDashboardCards.map((module) => ({
        title: module.title,
        description: module.description,
        route: module.href,
        action: module.buttonLabel,
        status: module.status
      })),
      routes: coreRoutes
    },
    request
  );
}
