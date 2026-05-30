export default function OmosPage() {
  return (
    <main className="space-y-6">
      <section className="glass-panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-300">Operating System</p>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white">OMOS · OneGodian Metaphysical Operating System™</h1>
        <p className="mt-3 max-w-3xl text-slate-300">Protocol, runtime documentation, page registry, and app bridge context for the OneGodian ecosystem.</p>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {[
          ['Manifest', '/omos/manifest', 'Runtime manifest and compatibility context.'],
          ['Pages', '/omos/pages', 'Synced page registry for public routes.'],
          ['Health', '/omos/health', 'Operational status and sync visibility.']
        ].map(([title, href, description]) => (
          <a key={href} href={href} className="mobile-card group">
            <h2 className="text-xl font-semibold text-white group-hover:text-gold-200">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
            <span className="mt-4 inline-flex text-xs font-semibold uppercase tracking-[0.22em] text-gold-300">Open →</span>
          </a>
        ))}
const omosOutline = [
  { title: 'Identity & Consciousness Layer', detail: 'Defines remembrance, identity continuity, self-reflection, and the human-facing meaning of participation.' },
  { title: 'Belief Mapping & Meaning Layer', detail: 'Organizes beliefs, values, stories, symbols, and interpretive patterns into navigable application content.' },
  { title: 'Ethics, Responsibility & Conduct Layer', detail: 'Frames voluntary participation, responsibility, public-safe language, and behavior expectations.' },
  { title: 'Language, Ritual & Cultural Signal Layer', detail: 'Turns names, phrases, campaigns, dates, practices, and recurring signals into coherent shared experience.' },
  { title: 'Application, Protocol & Runtime Layer', detail: 'Connects OMOS concepts to routes, manifests, APIs, dashboards, status tables, tools, and production software.' }
];

export default function OmosPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">OMOS</p>
        <h1 className="mt-2 text-3xl font-bold">OneGodian Metaphysical Operating System</h1>
        <p className="mt-3 max-w-4xl text-slate-300">OMOS translates OneGodian metaphysical, cultural, ethical, and protocol concepts into a practical operating model that can be represented in software, content, dashboards, and public-facing workflows.</p>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        {omosOutline.map((item) => (
          <article key={item.title} className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
            <h2 className="text-xl font-semibold text-cyan-100">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">{item.detail}</p>
          </article>
        ))}
        <h1 className="text-3xl font-bold">OMOS</h1>
        <p className="mt-2 text-slate-300">The OneGodian Metaphysical Operating System documents structure, protocols, routes, and operating context for the ecosystem.</p>
      </section>
    </main>
  );
}
