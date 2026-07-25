import { z } from 'zod';
import { ODC_TOKEN } from './odc';
export const addressSchema=z.string().trim().regex(/^0x[a-fA-F0-9]{40}$/,'Enter a valid Ethereum address.');
export const transactionHashSchema=z.string().trim().regex(/^0x[a-fA-F0-9]{64}$/,'Enter a valid Ethereum transaction hash.');
export interface ExplorerProvider { getNetworkStatus():Promise<unknown>; getTokenMetadata(address:string):Promise<unknown>; getTokenTransfers(params:unknown):Promise<unknown>; getAddressBalance(address:string):Promise<unknown>; getAddressTransfers(address:string):Promise<unknown>; getTransaction(hash:string):Promise<unknown>; }
export class ProviderUnavailableError extends Error { constructor(){super('Data provider not configured');} }
export const providerConfigured=()=>Boolean(process.env.EXPLORER_API_URL && process.env.EXPLORER_API_KEY);
export function getExplorerProvider():ExplorerProvider { const unavailable=async()=>{throw new ProviderUnavailableError()}; return {getNetworkStatus:unavailable,getTokenMetadata:unavailable,getTokenTransfers:unavailable,getAddressBalance:unavailable,getAddressTransfers:unavailable,getTransaction:unavailable}; }
export const etherscanTokenUrl=`https://etherscan.io/token/${ODC_TOKEN.contractAddress}`;
