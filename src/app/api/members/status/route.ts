import { NextResponse } from 'next/server';
export async function GET() { return NextResponse.json({ restBase: process.env.MEMBERS_REST_BASE_URL ?? null, endpoints: ['health', 'manifest', 'me', 'admin/summary'], status: 'monitoring' }); }
