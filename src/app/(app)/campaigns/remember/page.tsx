import Link from 'next/link';
import { rememberCampaign } from '@/lib/onegodian-content';

export default function RememberCampaignPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-violet-400/30 bg-slate-900/70 p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-violet-200">THE ONEGODIAN</p>
        <h1 className="mt-2 text-3xl font-bold">Remember Campaign</h1>
        <p className="mt-3 max-w-4xl text-slate-300">{rememberCampaign.purpose}</p>
        <p className="mt-4 text-cyan-300">{rememberCampaign.officialStartDate} · {rememberCampaign.onegodianDate}</p>
      </section>
      <section className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
        <h2 className="text-xl font-semibold text-cyan-200">Campaign message</h2>
        <p className="mt-3 text-lg text-slate-200">{rememberCampaign.message}</p>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        {rememberCampaign.dashboardFunctions.map((item) => (
          <article key={item} className="rounded-xl border border-slate-700 bg-slate-950/60 p-4 text-sm text-slate-300">{item}</article>
        ))}
      </section>
      <div className="flex flex-wrap gap-3">
        <Link href="/campaigns" className="rounded-full border border-cyan-400/70 px-4 py-2 text-sm font-semibold text-cyan-200">View Campaigns</Link>
        <Link href="/support" className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950">Support OneGodian</Link>
      </div>
    </main>
  );
}
