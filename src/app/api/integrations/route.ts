import { NextResponse } from 'next/server';
export function GET() { return NextResponse.json({ integrations: ['wordpress', 'ino-platform-plugin', 'member-dashboard', 'admin-portal', 'mobile-api'] }); }
