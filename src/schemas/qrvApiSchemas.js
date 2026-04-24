import { z } from 'zod';

const utcDateTime = z.string().datetime({ offset: true });

export const qrvidSchema = z.string().regex(/^QRV-[A-Z0-9-]{6,64}$/i, 'qrvid must match QRV pattern');

export const qrvidParamSchema = z.object({ qrvid: qrvidSchema }).strict();

export const createRecordSchema = z.object({
  qrvid: qrvidSchema,
  issuer: z.string().min(1).max(128),
  subject: z.string().min(1).max(256),
  issued_at_utc: utcDateTime,
  expires_at_utc: utcDateTime.optional(),
  metadata_hash: z.string().regex(/^[A-Fa-f0-9]{32,128}$/, 'metadata_hash must be hex string'),
}).strict();

export const revokeByBodySchema = z.object({
  qrvid: qrvidSchema,
  revoked_at_utc: utcDateTime,
  reason: z.string().min(3).max(512),
}).strict();

export const revokeByPathSchema = z.object({
  revoked_at_utc: utcDateTime,
  reason: z.string().min(3).max(512),
}).strict();
