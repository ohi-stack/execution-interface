import Link from 'next/link';
import { rememberCampaign } from '@/lib/onegodian-content';

export default function RememberPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-violet-400/30 bg-slate-900/70 p-6">
        <h1 className="text-3xl font-bold">Remember</h1>
        <p className="mt-2 text-slate-300">{rememberCampaign.purpose}</p>
      </section>
      <Link href="/campaigns/remember" className="inline-flex rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950">Open Remember Campaign</Link>
    </main>
  );
}
