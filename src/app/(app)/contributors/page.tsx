import { ContributorsContent, PageHero, PluginBridgeGrid } from '@/components/OneGodianAppPages';

export default function ContributorsPage() {
  return (
    <main className="space-y-6 sm:space-y-8">
      <PageHero eyebrow="Contributors" title="Contributors" body="Contributors support ONEGODIAN, LLC public-facing products, education, media, technology, membership, and community infrastructure." />
      <ContributorsContent />
      <PluginBridgeGrid />
    </main>
  );
}
