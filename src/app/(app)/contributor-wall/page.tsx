import { PageHero, PluginBridgeGrid } from '@/components/OneGodianAppPages';

export default function ContributorWallPage() {
  return (
    <main className="space-y-6 sm:space-y-8">
      <PageHero eyebrow="Contributor Wall" title="Contributor Wall" body="A recognition surface for approved voluntary supporters of OneGodian public-facing products, education, media, technology, membership, and community infrastructure." />
      <section className="mobile-card">
        <code className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm font-bold text-gold-100">[onegodian_contributor_wall]</code>
        <p className="mt-4 text-sm leading-6 text-slate-300">Contributor recognition is displayed only when approved contributor data is available through the plugin or backend bridge.</p>
      </section>
      <PluginBridgeGrid />
    </main>
  );
}
