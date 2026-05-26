import { jsonResponse } from '@/lib/api-json';

export async function GET(request: Request) {
  return jsonResponse(
    {
      app: 'OMOS Runtime',
      status: 'ok',
      environment: 'production',
      version: '1.0.1',
      canonicalHost: 'https://omos.onegodian.com',
      publicRouteCount: 15,
      pluginSync: 'available'
    },
    request
  );
}
