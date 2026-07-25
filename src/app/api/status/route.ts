import { NextResponse } from 'next/server'; import { ODC, apiPayload, cacheHeaders, features } from '@/lib/odc';
export function GET(){return NextResponse.json(apiPayload({ platform: 'operational', network: 'Ethereum Mainnet', features }),{headers:cacheHeaders})}
