import { NextResponse } from 'next/server';
export async function GET() { return NextResponse.json({ surface: 'console', status: 'ok', logs: [] }); }
