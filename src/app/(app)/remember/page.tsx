import Link from 'next/link';
export default function Page() { return <main className="space-y-6"><h1 className="text-3xl font-bold">OneGodian: Remember</h1><p className="text-slate-300">OneGodian: Remember is a public campaign inviting people to reconnect with identity, dignity, unity, and responsibility through practical action and shared memory.</p></main>; }
import Link from 'next/link';
import { rememberCampaign } from '@/lib/onegodian-content';

export default function RememberPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Campaign</p>
        <h1 className="mt-2 text-3xl font-bold">OneGodian: Remember</h1>
        <p className="mt-3 text-slate-300">You were always One — you simply forgot. Remember who you are.</p>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
          <h2 className="text-xl font-semibold">Campaign Intent</h2>
          <p className="mt-2 text-sm text-slate-300">A public-safe awareness campaign focused on identity, remembrance, dignity, unity, and shared human connection.</p>
        </article>
        <article className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
          <h2 className="text-xl font-semibold">Participation</h2>
          <p className="mt-2 text-sm text-slate-300">Creators, members, and supporters can access campaign media, captions, releases, and distribution pathways from the dashboard.</p>
          <Link href="/dashboard" className="mt-3 inline-block text-cyan-300">Open Dashboard</Link>
        </article>
      <header className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6">
        <h1 className="text-3xl font-bold">OneGodian: Remember</h1>
        <p className="mt-2 text-slate-300">{rememberCampaign.message}</p>
        <p className="mt-2 text-sm text-cyan-300">Campaign start: {rememberCampaign.officialStartDate} · {rememberCampaign.onegodianDate}</p>
      </header>
      <section className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
        <p className="text-slate-300">{rememberCampaign.purpose}</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-300">
          {rememberCampaign.dashboardFunctions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <Link href="/campaigns/remember" className="mt-4 inline-block text-cyan-300">Open campaign module</Link>
      </section>
    </main>
  );
}
