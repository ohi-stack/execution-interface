import { NextResponse } from 'next/server';
import { blockchainProviders, CHAIN_ID, ODC_CONTRACT } from '@/lib/odc-wallet';

export async function GET() {
  const configured = blockchainProviders().length > 0;
  return NextResponse.json({
    network: 'ethereum-mainnet',
    chainId: CHAIN_ID,
    odcContractAddress: ODC_CONTRACT,
    status: configured ? 'configured' : 'unavailable',
    authoritativeSource: 'Ethereum',
    checkedAt: new Date().toISOString(),
  }, { status: configured ? 200 : 503 });
}
