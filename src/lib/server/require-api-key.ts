import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { ENV } from '@/config/env';

export function requireApiKey(req: NextRequest) {
  const key = req.headers.get('x-api-key') ?? req.headers.get('x-omos-app-key');
  const expectedKey = process.env.OMOS_APP_KEY ?? ENV.API_KEY;

  if (!expectedKey) {
    return NextResponse.json({ error: 'api_key_not_configured' }, { status: 503 });
  }

  if (!key || key !== expectedKey) {
    return NextResponse.json({ error: 'invalid_api_key' }, { status: 401 });
  }

  return null;
}
