import { statusModules } from '@/data/status';

const tone = {
  active: 'border-purple-300/45 bg-purple-300/10 text-purple-100',
  ready: 'border-gold-300/45 bg-gold-300/10 text-gold-100',
  'needs-work': 'border-slate-500/35 bg-slate-800/35 text-slate-200'
};

export function StatusGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {statusModules.map((item) => (
        <article key={item.module} className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-sovereign">
          <div className={`inline-flex rounded-full border px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.16em] ${tone[item.readiness]}`}>
            {item.readiness.replace('-', ' ')}
          </div>
          <h3 className="mt-4 text-xl font-black text-white">{item.module}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">{item.status}</p>
        </article>
      ))}
    </div>
  );
}
