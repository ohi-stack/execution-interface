import { NextResponse } from 'next/server'; import { ODC, apiPayload, cacheHeaders } from '@/lib/odc';
export function GET(){return NextResponse.json(apiPayload({ address: ODC.contract, network: ODC.network, chainId: ODC.chainId, standard: ODC.standard, explorer: `https://etherscan.io/token/${ODC.contract}` }),{headers:cacheHeaders})}
