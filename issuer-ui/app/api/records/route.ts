import { NextRequest, NextResponse } from 'next/server';
import { createIssuerRecord } from '../../../lib/issuerApi';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const record = await createIssuerRecord(payload);

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unexpected issuer API error.',
      },
      { status: 502 },
    );
  }
}
