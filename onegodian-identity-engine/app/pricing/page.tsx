import { PricingCards } from '@/components/PricingCards';

export default function PricingPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-4xl font-semibold">Pricing</h1>
      <p className="text-zinc-300">Simple one-time checkout with instant fulfillment.</p>
      <PricingCards />
    </section>
  );
}
