import { PageHeader } from '@/components/PageHeader';
import { accPositioning, accRepository, separationRules } from '@/lib/acc-content';

export default function DocsPage() {
  return (
    <main className="space-y-6">
      <PageHeader eyebrow="ACC Doctrine" title="Canonical repository and deployment doctrine" description="ACC is isolated as ohi-stack/acc and deployed to acc.onegodian.com as the operator-facing interface only." />
      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-3xl border border-white/10 bg-white/[0.055] p-5">
          <h2 className="text-2xl font-black text-white">Canonical placement</h2>
          <dl className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
            <div><dt className="font-black text-slate-100">Repository</dt><dd>{accRepository.url}</dd></div>
            <div><dt className="font-black text-slate-100">Deployment</dt><dd>{accRepository.deployTarget}</dd></div>
            <div><dt className="font-black text-slate-100">Boundary</dt><dd>{accPositioning.boundary}</dd></div>
          </dl>
        </article>
        <article className="rounded-3xl border border-amber-300/30 bg-amber-300/10 p-5">
          <h2 className="text-2xl font-black text-white">Do-not-merge policy</h2>
          <ul className="mt-4 space-y-3 text-sm font-semibold leading-6 text-amber-50">
            {separationRules.map((rule) => <li key={rule}>• {rule}</li>)}
          </ul>
        </article>
      </section>
    </main>
  );
}
