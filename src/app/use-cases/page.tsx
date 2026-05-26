const useCases = [
  { title: 'Certificate Verification', body: 'Validate training, academic, and professional certificates in real time.' },
  { title: 'Identity Verification', body: 'Prove identity claims without exposing sensitive personal data.' },
  { title: 'Product Verification', body: 'Confirm product authenticity across supply chain checkpoints.' },
  { title: 'Property Verification', body: 'Verify ownership and title history for physical or digital property assets.' }
];

export default function UseCasesPage() {
  return <main className="mx-auto max-w-6xl px-4 py-10"><h1 className="text-3xl font-bold">Verification Use Cases</h1><div className="mt-6 grid gap-4 md:grid-cols-2">{useCases.map((item)=><section key={item.title} className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5"><h2 className="text-xl font-semibold text-cyan-200">{item.title}</h2><p className="mt-2 text-sm text-slate-300">{item.body}</p></section>)}</div></main>;
}
