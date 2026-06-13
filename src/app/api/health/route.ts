import { NextResponse } from 'next/server';
export function GET() { return NextResponse.json({ status: 'ok', service: 'omos-site', domain: 'OMOS.OneGodian.com', version: '1.0.0' }); }
