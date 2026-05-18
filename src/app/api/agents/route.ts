import { NextResponse } from 'next/server';
export async function GET() { return NextResponse.json({ service: 'agents', surface: 'console', status: 'ok' }); }
