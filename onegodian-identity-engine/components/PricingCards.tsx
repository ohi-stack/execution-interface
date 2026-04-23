'use client';

import { PRODUCTS } from '@/lib/pricing';

export function PricingCards() {
  const createCheckout = async (tier: string) => {
    const res = await fetch('/api/checkout/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier })
    });

    if (!res.ok) {
      alert('Unable to launch checkout');
      return;
    }

    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {PRODUCTS.map((item) => (
        <article key={item.tier} className="card-panel p-6">
          <h3 className="text-xl font-semibold text-gold">{item.label}</h3>
          <p className="mt-2 text-sm text-zinc-300">{item.description}</p>
          <p className="mt-4 text-4xl font-bold">${item.amount / 100}</p>
          <ul className="mt-4 space-y-2 text-sm text-zinc-300">
            <li>{item.downloads === 999 ? 'Unlimited' : item.downloads} HD download(s)</li>
            <li>{item.premiumSeal ? 'Premium seal styling' : 'Standard seal styling'}</li>
            <li>Automated email delivery</li>
          </ul>
          <button
            onClick={() => createCheckout(item.tier)}
            className="mt-6 w-full rounded-full border border-gold bg-gold/10 px-4 py-2 text-sm font-semibold text-gold hover:bg-gold hover:text-black"
          >
            Choose {item.label}
          </button>
        </article>
      ))}
    </div>
  );
}
