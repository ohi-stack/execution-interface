import { NextRequest, NextResponse } from 'next/server';
import { z, ZodSchema } from 'zod';
import { currentSession } from '@/lib/auth';

export const passwordSchema = z.string().min(12).max(128).regex(/[a-z]/).regex(/[A-Z]/).regex(/[0-9]/).regex(/[^A-Za-z0-9]/);
export async function jsonBody<T>(req: NextRequest, schema: ZodSchema<T>) { return schema.parse(await req.json()); }
export function authenticated() { const session = currentSession(); return session ? { session } : { response: NextResponse.json({ error: 'authentication_required' }, { status: 401 }) }; }
export function safeError(status = 400, code = 'invalid_request') { return NextResponse.json({ error: code }, { status }); }
