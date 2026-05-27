const portals = [
  ['OneGodian.org', 'https://onegodian.org', 'Public institution-facing website and cultural/education communication.'],
  ['OneGodian.com', 'https://onegodian.com', 'Commerce and identity product engine for products, memberships, and digital delivery.'],
  ['u.OneGodian.com', 'https://u.onegodian.com', 'Learning and curriculum platform.'],
  ['app.OneGodian.com', 'https://app.onegodian.com', 'Public/member app dashboard and route node.'],
  ['galaxy.OneGodian.com', 'https://galaxy.onegodian.com', 'Galaxy/world platform and discovery layer.'],
  ['OMOS.OneGodian.com', 'https://omos.onegodian.com', 'OMOS specification and runtime documents.'],
  ['QuantumOHI.com', 'https://quantumohi.com', 'Quantum OHI architecture and model context.'],
  ['QRV.Network', 'https://qrv.network', 'Verification network for trusted records and credentials.']
] as const;

export default function Page() {
  return <main className="space-y-6"><h1 className="text-3xl font-bold">OneGodian Ecosystem</h1><p className="text-slate-300">This page maps the live OneGodian ecosystem and explains how each production property serves public access, member workflows, and platform operations.</p><div className="grid gap-4 md:grid-cols-2">{portals.map(([name, href, desc]) => <article key={name} className="rounded-xl border border-slate-700 bg-slate-900/60 p-4"><a href={href} className="text-cyan-300" target="_blank" rel="noreferrer">{name}</a><p className="mt-2 text-sm text-slate-300">{desc}</p></article>)}</div></main>;
import { ecosystemPortals } from '@/lib/onegodian-content';

export default function EcosystemPage() {
  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-bold">OneGodian Ecosystem</h1>
      <p className="text-slate-300">Connected properties across identity, commerce, education, runtime systems, and verification infrastructure.</p>
      <section className="grid gap-4 md:grid-cols-2">
        {ecosystemPortals.map((p) => (
          <article key={p.name} className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
            <h2 className="font-semibold">{p.name}</h2>
            <p className="text-sm text-slate-300">{p.role}</p>
            <a href={p.url} target="_blank" rel="noreferrer" className="text-cyan-300">{p.url}</a>
          </article>
        ))}
      </section>
    </main>
  );
}
