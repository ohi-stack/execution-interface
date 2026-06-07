import type { Metadata } from 'next';
import Link from 'next/link';
import { BeliefMapperHero } from '@/components/belief-mapper/BeliefMapperHero';
import { PremiumUpgradeCard } from '@/components/belief-mapper/PremiumUpgradeCard';
import { ResultCard } from '@/components/belief-mapper/ResultCard';
import { beliefMapperResults } from '@/lib/beliefMapper/scoring';
import { CardGrid, ProductionDocCard } from '@/app/components/omos-docs-ui';
import { getProductionDocPage, productionRelease } from '@/lib/production-docs';

const docPage = getProductionDocPage('belief-mapper')!;

export const metadata: Metadata = {
  title: `Belief Mapper | ${productionRelease.name}`,
  description: docPage.description,
  alternates: { canonical: '/belief-mapper' },
  openGraph: { title: docPage.title, description: docPage.description, url: '/belief-mapper', type: 'website' }
};

const routes = [
  ['/belief-mapper/start', 'Start'],
  ['/belief-mapper/results', 'Results'],
  ['/belief-mapper/profile', 'Profile'],
  ['/belief-mapper/journal', 'Journal'],
  ['/belief-mapper/certificate', 'Certificate'],
  ['/belief-mapper/timeline', 'Timeline'],
  ['/belief-mapper/premium', 'Premium']
];

export default function BeliefMapperPage() {
  return (
    <main className="space-y-8">
      <BeliefMapperHero />
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {routes.map(([href, label]) => (
          <Link key={href} href={href} className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4 text-sm font-semibold text-slate-100 hover:border-cyan-300">
            {label} <span className="block pt-1 font-mono text-xs text-cyan-300">{href}</span>
          </Link>
        ))}
      </section>
      <section className="glass-panel p-5 sm:p-7">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-gold-300">Production documentation</p>
        <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white">{docPage.title}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">{docPage.summary}</p>
        <div className="mt-5">
          <CardGrid cols="lg:grid-cols-5">
            {docPage.cards.map((card) => <ProductionDocCard key={card.title} {...card} />)}
          </CardGrid>
        </div>
      </section>
      <section className="grid gap-4 lg:grid-cols-[1fr_0.75fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {beliefMapperResults.map((result) => <ResultCard key={result.id} result={result} />)}
        </div>
        <PremiumUpgradeCard />
      </section>
    </main>
  );
}
