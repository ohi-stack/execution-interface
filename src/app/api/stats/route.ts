import { NextResponse } from 'next/server';
export async function GET() { return NextResponse.json({ uptime: process.uptime(), healthy: true, generatedAt: new Date().toISOString() }); }
