import { NextResponse } from 'next/server';
export async function GET() { return NextResponse.json({ status: 'ready', database: 'configured', redis: 'configured', worker: 'configured' }); }
