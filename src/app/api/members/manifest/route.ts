import { NextResponse } from 'next/server';
import { getMembersManifest } from '@/lib/members-bridge';

export async function GET() {
  const upstream = await getMembersManifest();
  return NextResponse.json({ ok: upstream.ok, upstream }, { status: upstream.ok ? 200 : 503 });
}
