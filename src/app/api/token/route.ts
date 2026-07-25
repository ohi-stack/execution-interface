import { NextResponse } from 'next/server'; import { ODC, apiPayload, cacheHeaders } from '@/lib/odc';
export function GET(){return NextResponse.json(apiPayload({ name: ODC.name, symbol: ODC.symbol, standard: ODC.standard, decimals: ODC.decimals, network: ODC.network, chainId: ODC.chainId, contract: ODC.contract }),{headers:cacheHeaders})}
