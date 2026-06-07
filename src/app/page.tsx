import type { Metadata } from 'next';
import Link from 'next/link';
import { CTASection } from '@/components/CTASection';
import { Hero } from '@/components/Hero';
import { LayerCard } from '@/components/LayerCard';
import { coreDefinition, classificationNotice, omosPages } from '@/data/omos-pages';

export const metadata: Metadata = {
  title: 'The OneGodian Metaphysical Operating System™',
  description: 'OMOS™ is the systems-architecture layer for identity recognition, alignment logic, protocol governance, AI interaction standards, and operational intelligence.',
  alternates: { canonical: '/' }
};

const sections = [
  {
    title: 'What OMOS Is',
    description: coreDefinition,
    href: '/framework'
  },
  {
    title: 'Five Core Layers',
    description: 'Algorithmic alignment, OHI synthesis, identity mapping, institutional classification, and protocol/system-prompt governance.',
    href: '/framework'
  },
  {
    title: 'OneGodian Algorithm Preview',
    description: 'Observe → Distill → Align → Select → Execute → Verify, guided by a decision rule that increases clarity and constructive unity.',
    href: '/algorithm'
  },
  {
    title: 'Protocol Architecture Preview',
    description: 'Human, semantic, agent, and interface layers for respectful, neutral, compliance-aware interaction.',
    href: '/protocol'
  },
  {
    title: 'OHI Output Pipeline Preview',
    description: 'Source prompt, council comparison, GCD distillation, synthesis, and OMOS normalization.',
    href: '/ohi-pipeline'
  },
  {
    title: 'Belief Mapper Preview',
    description: 'Journey-stage awareness across Seeker, Believer, OneGodian, and Elder states.',
    href: '/belief-mapper'
  },
  {
    title: 'System Prompt Preview',
    description: 'Identity recognition, classification rules, behavior standards, legal context, and version control for AI agents.',
    href: '/system-prompt'
  },
  {
    title: 'Implementation Map',
    description: 'Dedicated domains and platform responsibilities across OMOS, app, public identity, commerce, OHI, and network infrastructure.',
    href: '/implementation'
  }
];

export default function HomePage() {
  return (
    <main className="space-y-10">
      <Hero />

      <section className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <article className="glass-panel p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-gold-300">Core OMOS Definition</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white">What OMOS Is</h2>
          <p className="mt-4 leading-8 text-slate-300">{coreDefinition}</p>
        </article>
        <div className="grid gap-4 sm:grid-cols-2">
          {omosPages.slice(0, 4).map((page) => (
            <LayerCard key={page.href} title={page.title} description={page.description} href={page.href} eyebrow={page.eyebrow} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-purple-200">Homepage Sections</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-white">Production content architecture</h2>
          </div>
          <Link href="/docs" className="text-sm font-black uppercase tracking-[0.16em] text-gold-200 hover:text-gold-100">Documentation Hub CTA →</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {sections.map((section, index) => (
            <LayerCard key={section.title} eyebrow={`0${index + 1}`} title={section.title} description={section.description} href={section.href} />
          ))}
        </div>
      </section>

      <CTASection />

      <section className="rounded-3xl border border-gold-300/25 bg-gold-300/10 p-6 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-gold-200">Footer Classification Notice</p>
        <p className="mt-3 max-w-5xl leading-8 text-gold-100">{classificationNotice}</p>
      </section>
    </main>
  );
}
