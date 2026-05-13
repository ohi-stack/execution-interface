import { NextResponse } from 'next/server';
export async function GET() { return NextResponse.json({ tools: ['registry', 'members', 'certificates', 'products', 'media'], status: 'ok' }); }
