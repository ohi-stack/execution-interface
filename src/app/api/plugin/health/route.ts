import { NextResponse } from 'next/server';
import manifest from '@/data/manifest.json';

export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      service: 'omos-plugin-bridge',
      runtime: 'omos-site',
      version: manifest.version,
      canonical_domain: manifest.canonical_domain,
      plugin_sync: 'available',
      allowed_wordpress_hosts: manifest.wordpress_hosts,
      generated_at: new Date().toISOString()
    },
    {
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'public, max-age=300'
      }
    }
  );
}
