import Link from 'next/link';
import { ConsolePage } from '@/components/ConsolePage';

export default function Page() {
  return <ConsolePage href="/learning">Learning connects members and visitors to education, resources, documentation, and community pathways on <Link href="https://onegodian.org" className="font-black text-amber-100">OneGodian.org</Link>.</ConsolePage>;
}
