import { NextResponse } from 'next/server';
import { MEMBERS_WORDPRESS_BASE_URL } from '@/lib/members';

export const dynamic = 'force-dynamic';

export async function GET() {
  const healthUrl = `${MEMBERS_WORDPRESS_BASE_URL}/wp-json/onegodian-members/v1/health`;

  try {
    const response = await fetch(healthUrl, { cache: 'no-store' });
    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json') ? await response.json() : { raw: await response.text() };

    return NextResponse.json({
      ok: response.ok,
      status: response.status,
      source: healthUrl,
      plugin: payload
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        source: healthUrl,
        error: error instanceof Error ? error.message : 'Unknown members plugin health error'
      },
      { status: 502 }
    );
  }
}
