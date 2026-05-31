const tools = [
  { title: 'Offer Generator', description: 'Purchase Agreement templates, LOI generator, seller-financing offers, PDF generation, version history, and deal merge fields.', href: '/offer-generator' },
  { title: 'OneGodian utilities', description: 'Reusable app utilities and operational helpers.' },
  { title: 'Member intake and onboarding forms', description: 'Structured forms for onboarding and member workflows.' },
  { title: 'Calculators and conversion tools', description: 'Scenario calculators and conversion helpers.' },
  { title: 'Internal app resources', description: 'References and operational app resources.' },
  { title: 'Operational checklists', description: 'Readiness, release, and production checklists.' },
  { title: 'Deployment and diagnostics links', description: 'Deployment status and diagnostic entry points.' }
];

export default function ToolsPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-orange-400/30 bg-slate-900/70 p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-orange-200">Tools</p>
        <h1 className="mt-2 text-3xl font-bold">OneGodian Tools</h1>
        <p className="mt-3 max-w-4xl text-slate-300">Use OneGodian utilities, forms, calculators, onboarding tools, conversion tools, and internal app resources.</p>
      </section>
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <article key={tool.title} className="rounded-xl border border-slate-700 bg-slate-900/60 p-5 text-slate-200">
            <h2 className="font-bold text-white">{tool.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">{tool.description}</p>
            {tool.href ? (
              <a href={tool.href} className="mt-4 inline-block text-xs font-black uppercase tracking-[0.2em] text-orange-200">Open Tool →</a>
            ) : null}
          </article>
        ))}
      </section>
    </main>
  );
}
