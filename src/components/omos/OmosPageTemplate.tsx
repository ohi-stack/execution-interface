import Link from 'next/link';
import { LayerCard } from '@/components/LayerCard';
import { PageHeader } from '@/components/PageHeader';
import { StatusGrid } from '@/components/StatusGrid';
import type { OmosPage } from '@/data/omos-pages';

export function OmosPageTemplate({ page }: { page: OmosPage }) {
  return (
    <main className="space-y-8">
      <PageHeader eyebrow={page.eyebrow} title={page.title} description={page.description} />
      {page.slug === 'status' ? <StatusGrid /> : null}
      {page.sections.length ? (
        <section className="grid gap-4 md:grid-cols-2">
          {page.sections.map((section) => (
            <LayerCard key={section.title} title={section.title} description={section.body} items={section.items} />
          ))}
        </section>
      ) : null}
      {page.cta ? (
        <section className="glass-panel p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-purple-200">Next Action</p>
          {page.cta.disabled ? (
            <button disabled className="mt-4 cursor-not-allowed rounded-full border border-slate-600 bg-slate-800/70 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-slate-400">
              {page.cta.label}
            </button>
          ) : (
            <Link href={page.cta.href} className="premium-button mt-4">{page.cta.label} →</Link>
          )}
        </section>
      ) : null}
    </main>
  );
}
