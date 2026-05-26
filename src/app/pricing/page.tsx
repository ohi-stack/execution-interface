const plans = [
  { name: 'Starter', price: '$49/mo', features: ['1 issuer seat', '5,000 verifications/mo', 'Email support'] },
  { name: 'Pro', price: '$299/mo', features: ['5 issuer seats', '100,000 verifications/mo', 'API access + SLA'] },
  { name: 'Institution', price: 'Contact sales', features: ['Unlimited seats', 'Custom throughput', 'Dedicated compliance support'] }
];

export default function PricingPage() {
  return <main className="mx-auto max-w-6xl px-4 py-10"><h1 className="text-3xl font-bold">Issuer Pricing</h1><div className="mt-6 grid gap-4 md:grid-cols-3">{plans.map((plan)=><section key={plan.name} className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5"><h2 className="text-xl font-semibold text-cyan-200">{plan.name}</h2><p className="mt-2 text-lg font-bold">{plan.price}</p><ul className="mt-3 space-y-2 text-sm text-slate-300">{plan.features.map((feature)=><li key={feature}>• {feature}</li>)}</ul></section>)}</div></main>;
}
