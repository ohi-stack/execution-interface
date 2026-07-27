import { ODC_TOKEN } from '@/lib/odc';
import { CopyButton } from '@/components/odc/CopyButton';

const facts = [
  ['Token name', ODC_TOKEN.name], ['Symbol', ODC_TOKEN.symbol], ['Network', ODC_TOKEN.network],
  ['Standard', ODC_TOKEN.standard], ['Maximum supply', ODC_TOKEN.maximumSupplyFormatted],
  ['Decimals', String(ODC_TOKEN.decimals)], ['Organization', ODC_TOKEN.organization],
  ['Developer / originator', ODC_TOKEN.developer],
] as const;

export function TokenRecord() {
  const explorer = `https://etherscan.io/token/${ODC_TOKEN.contractAddress}`;
  return <div className="token-record"><dl>{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><div className="contract-record"><span>Official contract</span><code>{ODC_TOKEN.contractAddress}</code><div className="actions"><CopyButton value={ODC_TOKEN.contractAddress} label="Copy contract" /><a className="button secondary" href={explorer} target="_blank" rel="noopener noreferrer">View on Etherscan <span aria-hidden="true">↗</span></a></div></div><p className="warning"><strong>Anti-impersonation notice:</strong> Verify every character. A token using the ODC name or symbol at another address may be unrelated or fraudulent.</p></div>;
}
