import { PageHero, PluginBridgeGrid } from '@/components/OneGodianAppPages';

export default function ReferralLinksPage() {
  return (
    <main className="space-y-6 sm:space-y-8">
      <PageHero eyebrow="Referral Links" title="Referral Links" body="Referral links are prepared as a bridge surface for creators and affiliates. Payment, commission, and earnings logic remains inactive until an approved backend exists." />
      <section className="mobile-card">
        <code className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm font-bold text-gold-100">[onegodian_referral_link]</code>
        <p className="mt-4 text-sm leading-6 text-slate-300">The app references the current WordPress referral shortcode and can route approved users to future generated links.</p>
      </section>
      <PluginBridgeGrid />
    </main>
  );
}
