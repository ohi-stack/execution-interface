import { jsonResponse } from '@/lib/api-json';

const productionRoutes = ['/dashboard', '/ecosystem', '/omos', '/registry', '/tools', '/members', '/certificates', '/products', '/media', '/settings', '/docs'];
const productionApis = ['/api/health', '/api/manifest', '/api/tools', '/api/stats'];

export async function GET(request: Request) {
  return jsonResponse(
    {
      app: 'The OneGodian App',
      status: 'ok',
      environment: process.env.NODE_ENV ?? 'development',
      version: '1.0.2',
      canonicalHost: 'https://app.onegodian.com',
      publicRouteCount: productionRoutes.length,
      productionRoutes,
      productionApis,
      pluginSync: 'available',
      generatedAt: new Date().toISOString()
    },
    request
  );
}
