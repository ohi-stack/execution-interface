import { NextResponse } from 'next/server';

const API_HEADERS = {
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff'
};

export function jsonResponse(data: unknown, request?: Request, init?: ResponseInit) {
  const pretty = request ? new URL(request.url).searchParams.get('pretty') === '1' : false;
  const status = init?.status ?? 200;
  const headers = new Headers(init?.headers);

  Object.entries(API_HEADERS).forEach(([key, value]) => headers.set(key, value));

  if (pretty) {
    headers.set('content-type', 'application/json; charset=utf-8');
    return new Response(JSON.stringify(data, null, 2), { status, headers });
  }

  return NextResponse.json(data, { status, headers });
}
