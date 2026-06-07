import type { Metadata } from 'next';
import { OmosPageTemplate } from '@/components/omos/OmosPageTemplate';
import { getOmosPage } from '@/data/omos-pages';

export const metadata: Metadata = {
  title: 'OMOS Documentation',
  description: 'OMOS documentation groups for core specifications, developer materials, institutional materials, and version control.',
  alternates: { canonical: '/docs' }
};

export default function DocsPage() {
  return <OmosPageTemplate page={getOmosPage('docs')!} />;
import Link from 'next/link';
import { CardGrid, InfoCard, OmosPage, StatusPill } from '@/app/components/omos-docs-ui';
import { docsHubCards, productionDashboardRows, productionRelease } from '@/lib/production-docs';

export const metadata: Metadata = {
  title: `Documentation Hub | ${productionRelease.name}`,
  description: 'Production documentation hub for OMOS framework, algorithm, protocol, OHI pipeline, Belief Mapper, status, health, and manifest surfaces.',
  alternates: { canonical: '/docs' },
  openGraph: {
    title: 'OMOS Documentation Hub',
    description: 'Production documentation hub for OMOS Release 1.0.',
    url: '/docs',
    type: 'website'
  }
};

export default function DocsPage() {
  return (
    <OmosPage
      eyebrow={`Docs Hub · Release ${productionRelease.version}`}
      title="Production documentation hub for OMOS Release 1.0."
      description="A mobile-responsive index of the framework, algorithm, protocol, OHI pipeline, Belief Mapper, status dashboard, health endpoint, and manifest endpoint."
      cta={[{ href: '/framework', label: 'Start with framework' }, { href: '/api/manifest', label: 'Open manifest' }]}
    >
      <CardGrid cols="lg:grid-cols-3">
        {docsHubCards.map((card) => (
          <Link key={card.href} href={card.href} className="mobile-card block">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-gold-300">{card.href}</p>
            <h2 className="mt-3 text-2xl font-black text-white">{card.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">{card.body}</p>
          </Link>
        ))}
      </CardGrid>
      <InfoCard title="Release surfaces" accent="green">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {productionDashboardRows.map((row) => (
            <Link key={row.href} href={row.href} className="rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-gold-300/50">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-black text-white">{row.surface}</h3>
                <StatusPill active>{row.status}</StatusPill>
              </div>
              <p className="mt-2 font-mono text-xs text-cyan-100">{row.href}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">{row.owner}</p>
            </Link>
          ))}
        </div>
      </InfoCard>
    </OmosPage>
  );
}
