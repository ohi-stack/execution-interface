import { NextRequest, NextResponse } from 'next/server';
import { postOmosEndpoint } from '@/lib/omos-bridge';

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const response = await postOmosEndpoint('/llm/chat', payload);

  if (!response.ok) {
    return NextResponse.json({ error: response.error || 'OMOS LLM gateway unavailable.' }, { status: 502 });
  }

  return NextResponse.json(response.data);
}
