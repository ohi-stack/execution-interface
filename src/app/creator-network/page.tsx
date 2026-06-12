import Link from 'next/link';
import { ConsolePage } from '@/components/ConsolePage';

export default function Page() {
  return (
    <ConsolePage href="/creator-network">
      <p>Creators, affiliates, educators, and community voices can help share OneGodian identity, education, public resources, products, and campaigns.</p>
      <Link href="/affiliate-dashboard" className="mt-5 inline-flex rounded-full border border-amber-200/60 bg-amber-200 px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-slate-950">Apply to Creator Network</Link>
    </ConsolePage>
  );
}
