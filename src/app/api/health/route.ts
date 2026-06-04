import { jsonResponse } from '@/lib/api-json';

const productionRoutes = ['/dashboard', '/ecosystem', '/registry', '/members', '/products', '/media', '/capital', '/omos', '/learning'];
const productionApis = ['/api/health', '/api/manifest', '/api/tools', '/api/stats'];

export async function GET(request: Request) {
  return jsonResponse(
    {
      app: 'OneGodian App Deploy',
      status: 'ok',
      environment: process.env.NODE_ENV ?? 'development',
      version: '1.0.1',
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
