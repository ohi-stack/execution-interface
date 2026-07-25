import { NextResponse } from 'next/server'; import { apiPayload, cacheHeaders } from '@/lib/odc';
export function GET(){return NextResponse.json(apiPayload({service:'odc-platform',health:'OK'}),{headers:cacheHeaders})}
