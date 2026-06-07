import { jsonResponse } from '@/lib/api-json';
import { capitalContent, learningContent, productionMetrics, registryContent, routeContent } from '@/data/onegodianContent';

export async function GET(request: Request) {
  return jsonResponse(
    {
      status: 'ok',
      app: 'OneGodian App',
      version: 'production',
      routeCount: Object.keys(routeContent).length,
      registryCards: registryContent.cards.length,
      learningModules: learningContent.cards.length,
      capitalReadinessCards: capitalContent.cards.length,
      metrics: productionMetrics
    },
    request
  );
}
