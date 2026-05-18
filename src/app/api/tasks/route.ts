import { NextResponse } from 'next/server';
export async function GET() { return NextResponse.json({ service: 'tasks', surface: 'console', status: 'ok' }); }
