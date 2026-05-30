const plans = [
  { name: 'Starter', price: '$49/mo', features: ['1 issuer seat', '5,000 verifications/mo', 'Email support'] },
  { name: 'Pro', price: '$299/mo', features: ['5 issuer seats', '100,000 verifications/mo', 'API access + SLA'] },
  { name: 'Institution', price: 'Contact sales', features: ['Unlimited seats', 'Custom throughput', 'Dedicated compliance support'] }
];

export default function PricingPage() {
  return (
    <main className="onegodian-surface mx-auto max-w-6xl px-4 py-10">
      <section className="glass-panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-300">Verification Network</p>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.035em] text-white">Issuer Pricing</h1>
      </section>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <section key={plan.name} className="mobile-card">
            <h2 className="text-xl font-bold text-white">{plan.name}</h2>
            <p className="mt-2 text-2xl font-black text-gold-300">{plan.price}</p>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-300">
              {plan.features.map((feature) => <li key={feature}><span className="mr-2 text-gold-300">✦</span>{feature}</li>)}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
