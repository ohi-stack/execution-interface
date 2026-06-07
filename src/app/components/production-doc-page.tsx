import { CardGrid, InfoCard, OmosPage, ProductionDocCard } from '@/app/components/omos-docs-ui';
import { type ProductionDocPage, productionRelease } from '@/lib/production-docs';

export function ProductionDocPageView({ page }: { page: ProductionDocPage }) {
  return (
    <OmosPage
      eyebrow={`${page.eyebrow} · Release ${productionRelease.version}`}
      title={page.title}
      description={page.description}
      cta={[{ href: '/docs', label: 'Open docs hub' }, { href: '/status', label: 'View status' }]}
    >
      <InfoCard title="Production summary" accent="gold">
        <p>{page.summary}</p>
        <p className="mt-3 font-mono text-xs uppercase tracking-[0.16em] text-gold-100">{productionRelease.name}</p>
      </InfoCard>
      <CardGrid cols="lg:grid-cols-3">
        {page.cards.map((card) => <ProductionDocCard key={card.title} {...card} />)}
      </CardGrid>
      <InfoCard title="Release acceptance checklist" accent="green">
        <ul className="list-disc space-y-2 pl-5">
          {page.checklist.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </InfoCard>
    </OmosPage>
  );
}
