import { jsonResponse } from '@/lib/api-json';
import { appName, appRoutes, appVersion, pluginBridgeShortcodes } from '@/lib/onegodian-app-content';

const productionApis = ['/api/health', '/api/manifest', '/api/tools', '/api/stats'];

export async function GET(request: Request) {
  return jsonResponse(
    {
      app: appName,
      status: 'ok',
      environment: process.env.NODE_ENV ?? 'development',
      version: appVersion,
      canonicalHost: 'https://app.onegodian.com',
      domainRole: 'public/member-facing app gateway',
      publicRouteCount: appRoutes.length,
      productionRoutes: appRoutes,
      productionApis,
      pluginBridgeShortcodeCount: pluginBridgeShortcodes.length,
      pluginSync: 'available',
      generatedAt: new Date().toISOString()
    },
    request
  );
}
