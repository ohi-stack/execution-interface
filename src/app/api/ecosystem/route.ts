import { NextResponse } from 'next/server'; import { ODC, apiPayload, cacheHeaders, features } from '@/lib/odc';
export function GET(){return NextResponse.json(apiPayload({ integrations: [{ name: 'ODC Public Platform', status: 'Production' }, { name: 'WordPress Bridge', status: 'Production' }], features }),{headers:cacheHeaders})}
