import type { Metadata } from 'next';
import { OmosPageTemplate } from '@/components/omos/OmosPageTemplate';
import { getOmosPage } from '@/data/omos-pages';

export const metadata: Metadata = {
  title: 'OMOS System Status',
  description: 'Module readiness grid for the OMOS framework, algorithm, protocol, OHI Pipeline, Belief Mapper Lite, docs, APIs, and plugin bridge.',
  alternates: { canonical: '/status' }
};

export default function StatusPage() {
  return <OmosPageTemplate page={getOmosPage('status')!} />;
import Link from 'next/link';
import { CardGrid, InfoCard, OmosPage, StatusPill } from '@/app/components/omos-docs-ui';
import { productionDashboardRows, productionRelease } from '@/lib/production-docs';

export const metadata: Metadata = {
  title: `Status Dashboard | ${productionRelease.name}`,
  description: 'Production status dashboard for OMOS documentation release pages, runtime endpoints, and release acceptance surfaces.',
  alternates: { canonical: '/status' },
  openGraph: {
    title: 'OMOS Production Status Dashboard',
    description: 'Live status dashboard for OMOS Release 1.0 documentation surfaces.',
    url: '/status',
    type: 'website'
  }
};

export default function StatusPage() {
  return (
    <OmosPage eyebrow={`Status · Release ${productionRelease.version}`} title="Production status dashboard." description="Track the release state of documentation pages, public navigation, sitemap inclusion, and API endpoint surfaces for OMOS Production Documentation Release 1.0.">
      <CardGrid cols="lg:grid-cols-4">
        <InfoCard title="Release" accent="gold"><StatusPill active>{productionRelease.status}</StatusPill><p className="mt-3">{productionRelease.name}</p></InfoCard>
        <InfoCard title="Theme" accent="cyan"><p>{productionRelease.theme}</p></InfoCard>
        <InfoCard title="Canonical host" accent="cyan"><p className="font-mono text-cyan-100">{productionRelease.canonicalHost}</p></InfoCard>
        <InfoCard title="Generated" accent="green"><p className="font-mono text-cyan-100">{productionRelease.releasedAt}</p></InfoCard>
      </CardGrid>
      <section className="overflow-hidden rounded-3xl border border-gold-300/20 bg-black/45">
        <div className="p-5"><h2 className="text-2xl font-black text-white">Release 1.0 surface table</h2><p className="mt-2 text-sm text-slate-300">Every listed surface is linked, documented, and classified for production visibility.</p></div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/[0.05] text-xs uppercase tracking-[0.16em] text-gold-200"><tr><th className="px-5 py-3">Surface</th><th className="px-5 py-3">Path</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Owner</th></tr></thead>
            <tbody className="divide-y divide-white/10">
              {productionDashboardRows.map((row) => <tr key={row.href}><td className="px-5 py-4 font-semibold text-white">{row.surface}</td><td className="px-5 py-4"><Link className="font-mono text-cyan-100 hover:text-gold-100" href={row.href}>{row.href}</Link></td><td className="px-5 py-4"><StatusPill active>{row.status}</StatusPill></td><td className="px-5 py-4 text-slate-300">{row.owner}</td></tr>)}
            </tbody>
          </table>
        </div>
      </section>
    </OmosPage>
  );
}
