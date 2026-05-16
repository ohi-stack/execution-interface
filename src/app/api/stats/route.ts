import { NextResponse } from 'next/server';
export async function GET() { return NextResponse.json({ app: 'OneGodian Control Plane', healthy: true, generatedAt: new Date().toISOString() }); }
