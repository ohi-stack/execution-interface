import { NextResponse } from 'next/server';
export function GET() { return NextResponse.json({ jobs: [], queues: ['sync', 'retry', 'dead-letter'] }); }
