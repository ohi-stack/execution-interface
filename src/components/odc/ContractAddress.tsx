import { ODC_TOKEN } from '@/lib/odc'; import { CopyButton } from './CopyButton';
export function ContractAddress({compact=false}:{compact?:boolean}){return <div className={`contract-address ${compact?'compact':''}`}><code>{ODC_TOKEN.contractAddress}</code><CopyButton value={ODC_TOKEN.contractAddress} label="Copy contract"/></div>}
