import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { ENV } from '@/config/env';

export function requireApiKey(req: NextRequest) {
  const key = req.headers.get('x-api-key');

  if (!key || key !== ENV.API_KEY) {
    return NextResponse.json({ error: 'invalid_api_key' }, { status: 401 });
  }

  return null;
}
