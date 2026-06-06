import Link from 'next/link';

type DashboardCardProps = {
  title: string;
  description: string;
  href: string;
  status?: string;
  accent?: 'gold' | 'cyan' | 'purple' | 'green';
};

const accentMap = {
  gold: 'from-gold-300/30 via-gold-300/8 to-transparent text-gold-100 border-gold-300/35',
  cyan: 'from-cyan-300/25 via-cyan-300/8 to-transparent text-cyan-100 border-cyan-300/30',
  purple: 'from-purple-300/25 via-purple-300/8 to-transparent text-purple-100 border-purple-300/30',
  green: 'from-emerald-300/20 via-emerald-300/8 to-transparent text-emerald-100 border-emerald-300/30'
};

export function DashboardCard({ title, description, href, status = 'Available', accent = 'gold' }: DashboardCardProps) {
  return (
    <article className="group relative min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-sovereign backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-gold-300/45 hover:bg-white/[0.08] sm:p-6">
      <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-br ${accentMap[accent]} opacity-90`} />
      <div className="relative flex min-h-52 flex-col">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 text-xl font-black tracking-[-0.02em] text-white">{title}</h3>
          <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.14em] ${accentMap[accent]}`}>
            {status}
          </span>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-300">{description}</p>
        <div className="mt-auto pt-6">
          <Link href={href} className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-gold-300/45 bg-gold-300 px-4 py-2 text-sm font-black uppercase tracking-[0.16em] text-obsidian shadow-gold transition hover:bg-gold-200 sm:w-auto">
            Open
          </Link>
        </div>
      </div>
    </article>
  );
}
