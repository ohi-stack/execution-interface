export default function Page() { return <main className="space-y-6"><h1 className="text-3xl font-bold">OneGodian: Remember</h1><p className="text-slate-300">OneGodian: Remember is a public campaign inviting people to reconnect with identity, dignity, unity, and responsibility through practical action and shared memory.</p></main>; }
import Link from 'next/link';
import { rememberCampaign } from '@/lib/onegodian-content';

export default function RememberPage() {
  return (
    <main className="space-y-6">
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
