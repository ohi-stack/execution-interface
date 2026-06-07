import { PageHero, PluginBridgeGrid } from '@/components/OneGodianAppPages';

export default function LearningPage() {
  return (
    <main className="space-y-6 sm:space-y-8">
      <PageHero eyebrow="Education" title="Learning" body="Learning connects members and public visitors to identity education, membership resources, community documentation, certificates, and OneGodian.org educational materials." />
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {['Identity Education', 'Membership Resources', 'Community Documentation', 'Member Certificates', 'OneGodian.org Education', 'Learning Support'].map((item) => (
          <article key={item} className="mobile-card">
            <h2 className="text-xl font-black tracking-[-0.02em] text-white">{item}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">Structured learning access for {item.toLowerCase()} within the public/member-facing app gateway.</p>
          </article>
        ))}
      </section>
      <PluginBridgeGrid />
    </main>
  );
}
