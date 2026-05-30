const tools = [
  'OneGodian utilities',
  'Member intake and onboarding forms',
  'Calculators and conversion tools',
  'Internal app resources',
  'Operational checklists',
  'Deployment and diagnostics links'
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
          <article key={tool} className="rounded-xl border border-slate-700 bg-slate-900/60 p-5 text-slate-200">{tool}</article>
        ))}
      </section>
    </main>
  );
}
