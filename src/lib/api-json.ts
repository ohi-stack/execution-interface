import { NextResponse } from 'next/server';

export function jsonResponse(data: unknown, request?: Request) {
  const pretty = request ? new URL(request.url).searchParams.get('pretty') === '1' : false;

  if (pretty) {
    return new Response(JSON.stringify(data, null, 2), {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8'
      }
    });
  }

  return NextResponse.json(data);
}
