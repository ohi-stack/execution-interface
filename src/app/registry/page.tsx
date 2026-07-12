import { qrvNetwork } from '@/data/capital-products';
import { ConsolePage } from '@/components/ConsolePage';

export default function Page() {
  return <ConsolePage href="/registry">Registry references organize identity, member certificates, Zolfi security records, INSTRYX workflow records, module entries, tools, and ecosystem proofs through {qrvNetwork.registry} without making the app a payment or securities system.</ConsolePage>;
}
