import { NextResponse } from 'next/server';
export function GET() { return NextResponse.json({ members: 0, syncObjects: 0, pendingJobs: 0, failedJobs: 0, apiLatencyMs: 0 }); }
