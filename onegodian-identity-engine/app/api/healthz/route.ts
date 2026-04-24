import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: process.env.SERVICE_NAME || 'issuer-qrv',
    timestamp: new Date().toISOString()
  });
}
