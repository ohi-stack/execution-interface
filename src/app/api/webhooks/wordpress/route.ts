import { NextResponse } from 'next/server';
import { preventReplay, toSyncObject, verifySignedWebhook } from '@/lib/sync-engine';
export async function POST(request: Request) {
  const body = await request.text();
  const ok = verifySignedWebhook(body, request.headers.get('x-ino-timestamp'), request.headers.get('x-ino-signature'));
  if (!ok) return NextResponse.json({ error: 'invalid_signature' }, { status: 401 });
  const eventId = request.headers.get('x-ino-event-id') ?? '';
  if (!eventId || !preventReplay(eventId)) return NextResponse.json({ error: 'replay_detected' }, { status: 409 });
  const payload = JSON.parse(body || '{}');
  return NextResponse.json({ accepted: true, idempotencyKey: eventId, syncObject: toSyncObject({ local_id: eventId, resource_type: payload.resource_type ?? 'wordpress' }) }, { status: 202 });
}
