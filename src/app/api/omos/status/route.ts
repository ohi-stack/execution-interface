import { NextResponse } from 'next/server';
export async function GET() { return NextResponse.json({ domain: 'https://omos.onegodian.com', bridge: 'configured by env', llmGateway: 'placeholder', status: 'operational' }); }
