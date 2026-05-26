import { headers } from 'next/headers';
import manifest from '@/data/manifest.json';
import { jsonResponse } from '@/lib/api-json';

export async function GET(request: Request) {
  const host = headers().get('host') ?? '';
  const isConsole = host.includes('console.onegodian.com');

  return jsonResponse(
    {
      ...manifest,
      generated_at: new Date().toISOString(),
      app_profile: isConsole ? 'internal-control-plane' : 'member-facing-app',
      pluginSync: {
        endpoints: ['/api/plugin-consumers', '/api/plugin-shortcodes', '/api/plugin-sync'],
        consumers: ['OneGodian.com', 'OneGodian.org', 'QuantumOHI.com']
      }
    },
    request
  );
}
