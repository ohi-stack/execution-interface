import { NextRequest, NextResponse } from 'next/server';
import { sendOmosChat } from '@/lib/omos-bridge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body?.message || typeof body.message !== 'string') {
      return NextResponse.json({ error: 'Invalid payload. "message" is required.' }, { status: 400 });
    }

    const response = await sendOmosChat(body);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'OMOS bridge error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
