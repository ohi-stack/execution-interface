import { z } from 'zod';

const utcDateTime = z.string().datetime({ offset: true });

export const qrvidSchema = z.string().regex(/^QRV-[A-Z0-9-]{6,64}$/i, 'qrvid must match QRV pattern');
export const qrvidParamSchema = z.object({ qrvid: qrvidSchema }).strict();

export const createRecordSchema = z.object({
  qrvid: qrvidSchema,
  issuer: z.string().min(1).max(128),
  subject: z.string().min(1).max(256),
  certificate_title: z.string().min(1).max(256).optional(),
  issuer_logo_url: z.string().url().optional(),
  proof_reference: z.string().min(3).max(512).optional(),
  issued_at_utc: utcDateTime,
  expires_at_utc: utcDateTime.optional(),
  metadata_hash: z.string().regex(/^[A-Fa-f0-9]{32,128}$/, 'metadata_hash must be hex string').optional(),
}).strict();

export const revokeByBodySchema = z.object({
  qrvid: qrvidSchema,
  revoked_at_utc: utcDateTime,
  reason: z.string().min(3).max(512),
}).strict();

export const revokeByPathSchema = z.object({ revoked_at_utc: utcDateTime, reason: z.string().min(3).max(512) }).strict();

export const issuerProvisionSchema = z.object({ issuer_id: z.string().min(3).max(128), issuer_name: z.string().min(1).max(256), status: z.enum(['ACTIVE', 'SUSPENDED']).default('ACTIVE') }).strict();
export const apiKeyProvisionSchema = z.object({ key_id: z.string().min(3).max(128), issuer_id: z.string().min(3).max(128), api_key: z.string().min(12).max(512) }).strict();

export const issuerSignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12),
  company_name: z.string().min(2).max(256),
}).strict();

export const verifyEmailSchema = z.object({ token: z.string().min(6) }).strict();

export const issuerProfileSchema = z.object({
  display_name: z.string().min(2).max(256),
  logo_url: z.string().url().optional(),
  website: z.string().url().optional(),
}).strict();

export const checkoutSchema = z.object({
  issuer_id: z.string().min(3),
  plan: z.enum(['starter', 'growth', 'pro']),
  trial_days: z.number().int().min(0).max(30).default(14),
}).strict();

export const planChangeSchema = z.object({ plan: z.enum(['starter', 'growth', 'pro']) }).strict();
