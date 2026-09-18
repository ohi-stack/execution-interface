import { NextResponse } from 'next/server';
import { getMembersBridgeConfigured, getMembersHealth } from '@/lib/members-bridge';

export async function GET() {
  const upstream = await getMembersHealth();
  return NextResponse.json({
    ok: upstream.ok,
    bridgeConfigured: getMembersBridgeConfigured(),
    upstream
  }, { status: upstream.ok ? 200 : 503 });
}
