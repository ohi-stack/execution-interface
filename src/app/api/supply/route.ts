import { NextResponse } from 'next/server'; import { ODC, apiPayload, cacheHeaders } from '@/lib/odc';
export function GET(){return NextResponse.json(apiPayload({ maximum: ODC.maximumSupply, decimals: ODC.decimals, unit: ODC.symbol, source: 'canonical contract' }),{headers:cacheHeaders})}
