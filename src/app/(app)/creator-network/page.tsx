import { CreatorNetworkContent, PageHero, PluginBridgeGrid } from '@/components/OneGodianAppPages';

export default function CreatorNetworkPage() {
  return (
    <main className="space-y-6 sm:space-y-8">
      <PageHero eyebrow="Creator Network" title="OneGodian Creator Network" body="Creators, affiliates, educators, and community voices can help share OneGodian identity, education, public resources, products, and campaigns." />
      <CreatorNetworkContent />
      <PluginBridgeGrid />
    </main>
  );
}
