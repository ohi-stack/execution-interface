import { NextResponse } from 'next/server';
export async function GET() { return NextResponse.json({ restBase: process.env.CAPITAL_REST_BASE_URL ?? null, dashboard: 'placeholder', compliance: 'visible', status: 'monitoring' }); }
