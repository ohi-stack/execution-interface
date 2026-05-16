import { NextResponse } from 'next/server';
export async function GET() { return NextResponse.json({ status: 'ok', tools: ['dashboard', 'ecosystem', 'registry', 'members', 'certificates', 'campaigns', 'media'] }); }
