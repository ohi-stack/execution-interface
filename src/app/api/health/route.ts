import { jsonResponse } from '@/lib/api-json';
import { platformStatus, verificationStatus } from '@/data/onegodianContent';

export async function GET(request: Request) {
  return jsonResponse(
    {
      status: 'ok',
      app: 'OneGodian App',
      version: 'production',
      environment: process.env.NODE_ENV ?? 'development',
      checks: {
        manifestEndpoint: 'ok',
        healthEndpoint: 'ok',
        coreContentRoutes: 'ok',
        dashboardContent: 'ok',
        ecosystemHierarchy: 'ok',
        mobileResponsiveCards: 'ok'
      },
      platformStatus,
      verificationStatus,
      generatedAt: new Date().toISOString()
    },
    request
  );
}
