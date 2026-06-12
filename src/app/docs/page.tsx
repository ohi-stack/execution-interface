import { PageHeader } from '@/components/PageHeader';
import { appPositioning, appRepository, domainStructure, pluginShortcodes } from '@/lib/acc-content';

export default function DocsPage() {
  return (
    <main className="space-y-6">
      <PageHeader eyebrow="App Documentation" title="OneGodian App content and plugin bridge" description={appPositioning.summary} />
      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-3xl border border-white/10 bg-white/[0.055] p-5">
          <h2 className="text-2xl font-black text-white">Canonical placement</h2>
          <dl className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
            <div><dt className="font-black text-slate-100">Repository</dt><dd>{appRepository.url}</dd></div>
            <div><dt className="font-black text-slate-100">Deployment</dt><dd>{appRepository.deployTarget}</dd></div>
            <div><dt className="font-black text-slate-100">Boundary</dt><dd>{appPositioning.boundary}</dd></div>
          </dl>
        </article>
        <article className="rounded-3xl border border-purple-300/30 bg-purple-400/10 p-5">
          <h2 className="text-2xl font-black text-white">Plugin bridge shortcodes</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {pluginShortcodes.map((shortcode) => <code key={shortcode} className="rounded-full border border-white/10 bg-slate-950/40 px-3 py-2 text-xs text-slate-200">{shortcode}</code>)}
          </div>
        </article>
      </section>
      <section className="rounded-3xl border border-amber-300/25 bg-amber-300/10 p-5">
        <h2 className="text-2xl font-black text-white">Domain roles</h2>
        <div className="mt-4 grid gap-3 text-sm text-amber-50 md:grid-cols-2">
          {domainStructure.map((domain) => <p key={domain.host}><strong>{domain.host}</strong> — {domain.role}</p>)}
        </div>
      </section>
    </main>
  );
}
