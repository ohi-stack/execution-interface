import { jsonResponse } from '@/lib/api-json';
import { omosRoutes } from '@/data/manifest';
import { statusSummary } from '@/data/status';
import { tools } from '@/data/tools';

export async function GET(request: Request) {
  return jsonResponse(
    {
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
