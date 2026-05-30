const useCases = [
  { title: 'Certificate Verification', body: 'Validate training, academic, and professional certificates in real time.' },
  { title: 'Identity Verification', body: 'Prove identity claims without exposing sensitive personal data.' },
  { title: 'Product Verification', body: 'Confirm product authenticity across supply chain checkpoints.' },
  { title: 'Property Verification', body: 'Verify ownership and title history for physical or digital property assets.' }
];

export default function UseCasesPage() {
  return (
    <main className="onegodian-surface mx-auto max-w-6xl px-4 py-10">
      <section className="glass-panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-300">Trust Rails</p>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.035em] text-white">Verification Use Cases</h1>
      </section>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {useCases.map((item) => (
          <section key={item.title} className="mobile-card">
            <h2 className="text-xl font-bold text-white">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">{item.body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
