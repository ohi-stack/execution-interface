import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import manifest from '@/data/manifest.json';

export async function GET() {
  const host = headers().get('host') ?? '';
  const isConsole = host.includes('console.onegodian.com');

  return NextResponse.json({
    ...manifest,
    generated_at: new Date().toISOString(),
    app_profile: isConsole ? 'internal-control-plane' : 'member-facing-app'
  });
}
