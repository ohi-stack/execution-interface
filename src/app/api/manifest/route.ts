import runtimeManifest from '@/data/manifest.json';
import { jsonResponse } from '@/lib/api-json';
import { ecosystemHierarchy, manifestEcosystem, routeContent } from '@/data/onegodianContent';

export async function GET(request: Request) {
  return jsonResponse(
    {
      ...runtimeManifest,
      app: 'OneGodian App',
      version: 'production',
      ecosystem: manifestEcosystem,
      domains: ecosystemHierarchy,
      contentRoutes: Object.entries(routeContent).map(([slug, content]) => ({
        path: `/${slug}`,
        title: content.title,
        cardCount: content.cards.length,
        portal: content.portal ?? null
      })),
      apiRoutes: ['/api/manifest', '/api/health', '/api/tools', '/api/stats'],
      commerceEngine: 'https://onegodian.com',
      interpretationPlatform: 'https://onegodian.org',
      generatedAt: new Date().toISOString()
    },
    request
  );
}
