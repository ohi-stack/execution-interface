import { NextResponse } from 'next/server';
export async function GET() { return NextResponse.json({ strategy: 'server-side proxy placeholder', header: 'X-OMOS-App-Key', plugins: { omos: 'monitoring', members: 'monitoring', capital: 'monitoring' } }); }
