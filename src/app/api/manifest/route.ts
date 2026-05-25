import manifest from '@/data/manifest.json';

export async function GET() {
  return Response.json({ ...manifest, generated_at: new Date().toISOString() });
  const host = headers().get('host') ?? '';
  const isConsole = host.includes('console.onegodian.com');

  return NextResponse.json(
    isConsole
      ? {
          app: 'OneGodian Console',
          domain: 'console.onegodian.com',
          type: 'internal-control-plane',
          version: '0.1.0',
          modules: [
            'dashboard',
            'apps',
            'plugins',
            'api-status',
            'deployments',
            'registry-admin',
            'certificate-admin',
            'member-admin',
            'system-health',
            'logs',
            'admin',
            'settings'
          ],
          appDashboard: 'https://app.onegodian.com'
        }
      : {
          app: 'OneGodian App',
          domain: 'app.onegodian.com',
          type: 'member-facing-app',
          version: '0.1.0',
          modules: [
            'dashboard',
            'ecosystem',
            'membership',
            'certificates',
            'campaigns',
            'media',
            'products',
            'learning',
            'tools',
            'profile',
            'settings'
          ],
          console: 'https://console.onegodian.com'
        }
  );
}
