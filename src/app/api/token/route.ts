import { NextResponse } from 'next/server'; import { ODC_TOKEN, apiSuccess, cacheHeaders } from '@/lib/odc';
export function GET(){return NextResponse.json(apiSuccess({...ODC_TOKEN,dataFreshness:new Date().toISOString()}),{headers:cacheHeaders})}
