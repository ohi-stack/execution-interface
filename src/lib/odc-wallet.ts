import { createHash, createHmac, randomBytes } from 'crypto';
import { Contract, JsonRpcProvider, formatUnits, getAddress, verifyMessage } from 'ethers';

export const ODC_CONTRACT = (process.env.ODC_CONTRACT_ADDRESS ?? '0x9eee1e3615efe0374a7588d2760db5ffb2d5ce98').toLowerCase();
export const CHAIN_ID = Number(process.env.ETHEREUM_CHAIN_ID ?? 1);
export const ODC_DECIMALS = Number(process.env.ODC_TOKEN_DECIMALS ?? 18);
const ERC20_ABI = ['function balanceOf(address) view returns (uint256)'];

export function normalizeAddress(address: string) { return getAddress(address).toLowerCase(); }
export function formatRawBalance(raw: string | bigint, decimals = 18) { return formatUnits(BigInt(raw), decimals); }
export function hashOpaque(value: string) { return createHash('sha256').update(value).digest('hex'); }
export function newNonce() { return randomBytes(24).toString('base64url'); }
export function verificationMessage(input: { domain: string; address: string; nonce: string; issuedAt: Date; expiresAt: Date }) {
  return `${input.domain} wants you to link this Ethereum account to your ODC account:\n${getAddress(input.address)}\n\nSigning links this public address only. It does not authorize a blockchain transaction or transfer ODC, ETH, or any asset. ODC will never request your private key or seed phrase.\n\nURI: https://${input.domain}\nVersion: 1\nChain ID: ${CHAIN_ID}\nNonce: ${input.nonce}\nIssued At: ${input.issuedAt.toISOString()}\nExpiration Time: ${input.expiresAt.toISOString()}`;
}
export function verifyWalletSignature(message: string, signature: string, expectedAddress: string) {
  return normalizeAddress(verifyMessage(message, signature)) === normalizeAddress(expectedAddress);
}
export function auditIntegrity(payload: unknown) {
  return createHmac('sha256', process.env.AUDIT_LOG_SECRET ?? 'development-only').update(JSON.stringify(payload)).digest('hex');
}

export interface BlockchainProvider { name: string; balances(address: string): Promise<{ blockNumber: bigint; eth: bigint; odc: bigint }>; }
class RpcProvider implements BlockchainProvider {
  private client: JsonRpcProvider;
  constructor(public name: string, url: string) { this.client = new JsonRpcProvider(url, CHAIN_ID, { staticNetwork: true }); }
  async balances(address: string) {
    const [blockNumber, eth, odc] = await Promise.all([this.client.getBlockNumber(), this.client.getBalance(address), new Contract(ODC_CONTRACT, ERC20_ABI, this.client).balanceOf(address) as Promise<bigint>]);
    return { blockNumber: BigInt(blockNumber), eth, odc };
  }
}
export function blockchainProviders() {
  return [['primary', process.env.ETHEREUM_RPC_PRIMARY], ['secondary', process.env.ETHEREUM_RPC_SECONDARY]].filter((x): x is [string, string] => Boolean(x[1])).map(([name, url]) => new RpcProvider(name, url));
}
export async function retrieveBalances(address: string) {
  const providers = blockchainProviders();
  if (!providers.length) throw new Error('Blockchain provider unavailable');
  let lastError: unknown;
  for (const provider of providers) { try { return { ...(await provider.balances(address)), sourceProvider: provider.name }; } catch (error) { lastError = error; } }
  throw new Error('Blockchain provider unavailable', { cause: lastError });
}
