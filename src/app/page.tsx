import Link from 'next/link';
import { AppStatusPanel } from '@/components/AppStatusPanel';
import { footerLinks, onegodianAppMeta, whatThisAppDoes } from '@/lib/onegodian-content';

export const metadata = {
  title: 'OneGodian App | Command Dashboard',
  description:
    'The official OneGodian App dashboard for identity, membership, certificates, systems, tools, campaigns, products, and ecosystem access.'
};

export default function HomePage() {
  return <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100"><div className="mx-auto max-w-6xl space-y-8">
    <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-8 sm:p-12"><p className="text-xs uppercase tracking-[0.2em] text-cyan-300">{onegodianAppMeta.eyebrow}</p><h1 className="mt-3 text-4xl font-bold sm:text-5xl">{onegodianAppMeta.title}</h1><p className="mt-4 max-w-2xl text-lg text-slate-300">{onegodianAppMeta.description}</p>
      <div className="mt-8 flex gap-3"><Link href={onegodianAppMeta.primaryCta.href} className="rounded-xl border border-slate-600 px-4 py-3">{onegodianAppMeta.primaryCta.label}</Link><Link href={onegodianAppMeta.secondaryCta.href} className="rounded-xl border border-slate-600 px-4 py-3">{onegodianAppMeta.secondaryCta.label}</Link></div>
    </section>
    <section className="rounded-2xl border border-slate-700 bg-slate-900/60 p-6"><h2 className="text-xl font-semibold">What This App Does</h2><ul className="mt-3 list-disc space-y-2 pl-6 text-slate-300">{whatThisAppDoes.map((item) => <li key={item}>{item}</li>)}</ul></section>
    <AppStatusPanel />
    <footer className="border-t border-slate-800 pt-8"><div className="flex flex-wrap gap-4 text-sm">{footerLinks.map((l)=><Link key={l.href} href={l.href}>{l.label}</Link>)}</div><p className="mt-4 text-xs text-slate-400">© 2026 ONEGODIAN™. Designed and written by One Gregory Onegodian™. All Rights Reserved.</p></footer>
  </div></main>;
}
