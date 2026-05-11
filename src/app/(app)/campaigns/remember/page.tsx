import { rememberCampaign } from '@/lib/onegodian-content';

export const metadata = { title: 'OneGodian App | Remember Campaign', description: 'THE ONEGODIAN: Remember Campaign tools and participation resources.' };

export default function RememberCampaignPage() {
  return <main className="space-y-6"><header className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6"><h1 className="text-3xl font-bold">{rememberCampaign.name}</h1><p className="mt-2 text-slate-300">{rememberCampaign.purpose}</p><p className="mt-2 text-sm text-cyan-300">{rememberCampaign.officialStartDate} / {rememberCampaign.onegodianDate}</p></header>
  <section className="rounded-2xl border border-slate-700 bg-slate-900/60 p-6"><h2 className="font-semibold">Core Message</h2><p className="mt-2">{rememberCampaign.coreMessage}</p></section>
  <section className="grid gap-3 sm:grid-cols-2">{rememberCampaign.sections.map((s)=> <article key={s.title} className="rounded-xl border border-slate-700 bg-slate-900/60 p-4"><h3 className="font-semibold">{s.title}</h3><p className="mt-2 text-sm text-slate-300">{s.body}</p></article>)}</section></main>;
}
