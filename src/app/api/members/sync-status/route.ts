import { NextResponse } from 'next/server';
import { getMembersBridgeConfigured, getMembersSyncStatus } from '@/lib/members-bridge';

export async function GET() {
  if (!getMembersBridgeConfigured()) {
    return NextResponse.json({ ok: false, error: 'ONEGODIAN_MEMBERS_BRIDGE_KEY is not configured.' }, { status: 503 });
  }
  const upstream = await getMembersSyncStatus();
  return NextResponse.json({ ok: upstream.ok, upstream }, { status: upstream.ok ? 200 : 503 });
}
