import Link from 'next/link';
import { rememberCampaign } from '@/lib/app-content';

export default function RememberPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Campaign</p>
        <h1 className="mt-2 text-3xl font-bold">OneGodian: Remember</h1>
        <p className="mt-3 max-w-4xl text-lg text-slate-200">{rememberCampaign.message}</p>
        <p className="mt-2 text-sm text-cyan-300">Campaign start: {rememberCampaign.officialStartDate} · {rememberCampaign.onegodianDate}</p>
      </section>
      <section className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <article className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
          <h2 className="text-xl font-semibold">Purpose</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">{rememberCampaign.purpose}</p>
          <Link href="/commerce" className="mt-4 inline-block text-sm font-semibold text-cyan-300">Connect campaign to commerce engine</Link>
        </article>
        <article className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
          <h2 className="text-xl font-semibold">Dashboard Functions</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-300">
            {rememberCampaign.dashboardFunctions.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </article>
      </section>
      <Link href="/campaigns/remember" className="inline-flex rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950">Open Remember Campaign</Link>
    </main>
  );
}
