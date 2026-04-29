const faqs = [
  ['How does free preview work?', 'Users can generate a watermark preview before paying for HD download.'],
  ['What happens after purchase?', 'Stripe webhook marks order paid, then HD assets and delivery email are sent automatically.'],
  ['Can users refer friends?', 'Yes. Every member receives a referral code tracked against conversions.']
];

export default function FaqPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold">FAQ</h1>
      <div className="space-y-4">
        {faqs.map(([q, a]) => (
          <article key={q} className="card-panel p-5">
            <h2 className="font-semibold text-gold">{q}</h2>
            <p className="mt-2 text-zinc-300">{a}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
