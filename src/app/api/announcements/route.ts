import { NextResponse } from 'next/server'; import { ODC, apiPayload, cacheHeaders } from '@/lib/odc';
export function GET(){return NextResponse.json(apiPayload({ announcements: [{ date: '2026-07-25', title: 'ODC Platform v1', status: 'Production' }] }),{headers:cacheHeaders})}
