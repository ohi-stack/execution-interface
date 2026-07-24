import crypto from 'crypto';
import { SyncObject } from '@/lib/platform';

const replayWindowMs = Number(process.env.WEBHOOK_REPLAY_WINDOW_MS ?? 300000);
const seen = new Map<string, number>();

export function checksumPayload(payload: unknown) {
  return crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}

export function signWebhook(body: string, timestamp: string, secret = process.env.WEBHOOK_SECRET ?? '') {
  return crypto.createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex');
}

export function verifySignedWebhook(body: string, timestamp: string | null, signature: string | null) {
  if (!timestamp || !signature || !process.env.WEBHOOK_SECRET) return false;
  const age = Math.abs(Date.now() - Number(timestamp));
  if (!Number.isFinite(age) || age > replayWindowMs) return false;
  const expected = signWebhook(body, timestamp);
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export function preventReplay(eventId: string) {
  const now = Date.now();
  for (const [id, expires] of seen) if (expires < now) seen.delete(id);
  if (seen.has(eventId)) return false;
  seen.set(eventId, now + replayWindowMs);
  return true;
}

export function toSyncObject(input: Partial<SyncObject> & { local_id: string; resource_type: string }): SyncObject {
  const now = new Date().toISOString();
  return {
    local_id: input.local_id,
    wordpress_id: input.wordpress_id ?? null,
    resource_type: input.resource_type,
    source_system: input.source_system ?? 'ino-platform-app',
    version: input.version ?? '1',
    checksum: input.checksum ?? checksumPayload(input),
    updated_at: input.updated_at ?? now,
    last_synced: input.last_synced ?? null,
    status: input.status ?? 'pending',
  };
}
