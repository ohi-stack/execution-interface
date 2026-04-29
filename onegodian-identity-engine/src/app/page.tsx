import { Hero } from '@/components/Hero';
import { PricingCards } from '@/components/PricingCards';

export default function HomePage() {
  return (
    <div className="space-y-10">
      <Hero />
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">High-conversion product flow</h2>
        <p className="text-zinc-300">Free preview, one-click checkout, email delivery, and dashboard tracking designed for mobile-first conversion.</p>
      </section>
      <PricingCards />
    </div>
  );
}
