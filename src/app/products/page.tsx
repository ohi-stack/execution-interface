import Link from 'next/link';
import { ConsolePage } from '@/components/ConsolePage';

export default function Page() {
  return <ConsolePage href="/products">Products are discovered in the app and routed to <Link href="https://onegodian.com" className="font-black text-amber-100">OneGodian.com</Link> for commerce, services, and payments.</ConsolePage>;
}
