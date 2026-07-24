import { NextResponse } from 'next/server';
import { APP_VERSION, PLATFORM_NAME, PRODUCTION_DOMAIN } from '@/lib/platform';
export function GET() { return NextResponse.json({ status: 'ok', service: PLATFORM_NAME, domain: PRODUCTION_DOMAIN, version: APP_VERSION }); }
