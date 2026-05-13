import { NextResponse } from 'next/server';
export async function GET() { return NextResponse.json({ app: 'OneGodian Control Plane', version: '1.0.0', modules: 7, timestamp: new Date().toISOString() }); }
