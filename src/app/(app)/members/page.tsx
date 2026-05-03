import Link from 'next/link';
const cards=[{title:'Member Profiles',description:'Profile, status, membership level, access, and account continuity.'},{title:'Certificates',description:'Issued records, downloads, verification links, and proof objects.'},{title:'Verification',description:'QR-V lookup, identity status, certificate validation, and access checks.'}];
export default function MembersPage(){return <main className="space-y-8"><section className="rounded-2xl border border-cyan-400/30 bg-slate-900/70 p-6 sm:p-8"><p className="text-xs uppercase tracking-[0.22em] text-cyan-300">ONEGODIAN APP · MEMBERS</p><h1 className="mt-3 text-3xl font-bold sm:text-4xl">OneGodian Members</h1><p className="mt-4 max-w-4xl text-sm leading-relaxed text-slate-300 sm:text-base">Identity, verification, profiles, certificates, membership access, and member-facing dashboard tools.</p><div className="mt-6 flex flex-wrap gap-3"><Link href="/identity" className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950">Verify Identity</Link><Link href="/" className="rounded-lg border border-cyan-400/60 px-4 py-2 text-sm font-semibold text-cyan-200">Back to Dashboard</Link></div></section><section className="grid gap-4 md:grid-cols-3">{cards.map(c=><article key={c.title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"><h2 className="text-xl font-semibold text-white">{c.title}</h2><p className="mt-3 text-sm leading-relaxed text-slate-300">{c.description}</p></article>)}</section><section className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6 text-sm text-slate-300">Roadmap: Profile shell active • Certificate handoff pending • Verification API pending.</section></main>}
const features = [
  ['🪪 Member ID', 'Digital profile and status system.'],
  ['📜 Certificates', 'Access issued records and downloads.'],
  ['🔐 Verification', 'QR-V and OBP-1 verification systems.'],
  ['👤 Profile System', 'Manage identity and ecosystem access.'],
  ['💎 Membership Levels', 'Spiritual, Business, Developer, Premium.']
];

const runtime = [
  ['Membership Runtime', 'Active'],
  ['Verification Layer', 'Connected'],
  ['Profile System', 'Staging'],
  ['Certificate Engine', 'Active']
];

export default function MembersPage() { return <main className="space-y-6">
  <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6">
    <h1 className="text-3xl font-bold">ONEGODIAN MEMBERS™</h1>
    <p className="mt-3 text-slate-300">Identity, verification, profiles, certificates, and membership access.</p>
    <div className="mt-4 flex gap-3"><button className="rounded-lg border border-cyan-400 px-4 py-2">Access Membership</button><button className="rounded-lg border border-slate-500 px-4 py-2">Verify Identity</button></div>
  </section>
  <section className="grid gap-4 md:grid-cols-2">{features.map(([t,d])=><article key={t} className="rounded-xl border border-slate-700 bg-slate-900/50 p-4"><h2 className="font-semibold">{t}</h2><p className="mt-2 text-sm text-slate-300">{d}</p></article>)}</section>
  <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6"><h2 className="text-xl font-semibold">Runtime Status Panel</h2><div className="mt-3 grid gap-2 sm:grid-cols-2">{runtime.map(([k,v])=><div key={k} className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-3 py-2 text-sm">{k}: <span className="text-cyan-300">{v}</span></div>)}</div></section>
</main>; }
