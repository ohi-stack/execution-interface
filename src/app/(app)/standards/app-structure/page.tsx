import Link from 'next/link';

const layers = [
  'Public Layer',
  'Dashboard Layer',
  'Admin Layer',
  'API Layer',
  'Data Layer',
  'Security Layer',
  'UI/UX Layer',
  'Documentation Layer',
  'Compliance Layer',
  'Deployment Layer'
] as const;

export default function OneGodianAppStructurePage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">OneGodian Standard</p>
        <h1 className="text-3xl font-semibold text-slate-100">App Structure Standard</h1>
        <p className="max-w-3xl text-slate-300">
          Every module must include all ten layers. Missing layers must be marked as <strong>planned</strong>,
          represented by a stub, or tracked with a checklist item before implementation is considered complete.
        </p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2">
        {layers.map((layer, index) => (
          <li key={layer} className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-sm text-slate-200">
            <span className="mr-2 text-cyan-300">{index + 1}.</span>
            {layer}
          </li>
        ))}
      </ul>

      <div className="rounded-xl border border-cyan-700/40 bg-cyan-950/20 p-4 text-sm text-cyan-100">
        Registry updates are required for module intake. Manage module status in{' '}
        <code className="rounded bg-slate-900 px-2 py-1">src/lib/app-modules.ts</code> and publish supporting docs in{' '}
        <code className="rounded bg-slate-900 px-2 py-1">docs/</code>.
      </div>

      <Link href="/docs" className="inline-flex rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-cyan-400 hover:text-cyan-200">
        Open docs index
      </Link>
    </section>
  );
}
