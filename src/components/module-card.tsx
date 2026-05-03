import Link from 'next/link';

type ModuleCardProps = {
  title: string;
  description: string;
  href?: string;
  accent?: 'cyan' | 'gold' | 'violet' | 'emerald' | 'magenta' | 'orange' | 'red' | 'silver';
  stats?: string[];
  glyph?: 'planet' | 'moons' | 'ecosystem' | 'registry' | 'media' | 'tools' | 'certificates' | 'dashboard';
  featured?: boolean;
};

const accentStyles = {
  cyan: 'from-cyan-400/80 to-cyan-500/30 border-cyan-400/35',
  gold: 'from-amber-300/80 to-amber-500/20 border-amber-300/35',
  violet: 'from-violet-400/80 to-violet-600/20 border-violet-400/35',
  emerald: 'from-emerald-400/80 to-emerald-600/20 border-emerald-400/35',
  magenta: 'from-fuchsia-400/80 to-fuchsia-600/20 border-fuchsia-400/35',
  orange: 'from-orange-400/80 to-orange-600/20 border-orange-400/35',
  red: 'from-red-400/80 to-red-600/20 border-red-400/35',
  silver: 'from-slate-300/70 to-slate-400/20 border-slate-300/35'
};

function Glyph({ glyph = 'dashboard' }: { glyph?: ModuleCardProps['glyph'] }) {
  const common = 'h-14 w-14 stroke-[1.5] text-cyan-200/80 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3';
  if (glyph === 'planet') return <svg viewBox="0 0 24 24" fill="none" className={common}><circle cx="12" cy="12" r="4.5" /><ellipse cx="12" cy="12" rx="9" ry="3.2" /><path d="M3 14c1.8 1.2 4.2 2 9 2s7.2-.8 9-2" /></svg>;
  if (glyph === 'moons') return <svg viewBox="0 0 24 24" fill="none" className={common}><circle cx="12" cy="12" r="2.8" /><circle cx="6.5" cy="8" r="1.6" /><circle cx="18" cy="15.5" r="1.8" /><path d="M4 12a8 8 0 0 1 8-8" /><path d="M20 12a8 8 0 0 1-8 8" /></svg>;
  if (glyph === 'ecosystem') return <svg viewBox="0 0 24 24" fill="none" className={common}><circle cx="6" cy="7" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="12" cy="17" r="2" /><path d="M7.8 8.1 10.2 15" /><path d="M16.2 7.1 13.8 15" /><path d="M8 7h8" /></svg>;
  return <svg viewBox="0 0 24 24" fill="none" className={common}><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M8 9h8M8 13h8M8 17h5" /></svg>;
}

export function ModuleCard({ title, description, href = '#', accent = 'cyan', stats = [], glyph = 'dashboard', featured = false }: ModuleCardProps) {
  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-2xl border bg-slate-900/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(34,211,238,0.18)] active:translate-y-0.5 ${accentStyles[accent]} ${
        featured ? 'sm:col-span-2 lg:col-span-1 lg:min-h-64' : ''
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(103,232,249,0.13),transparent_50%),linear-gradient(135deg,rgba(15,23,42,0.85),rgba(2,6,23,0.95))]" />
      <div className="absolute right-2 top-2 opacity-90">
        <Glyph glyph={glyph} />
      </div>
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accentStyles[accent].split(' ').slice(0, 2).join(' ')}`} />
      <div className="relative">
        <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
        <p className="mt-2 max-w-[85%] text-sm text-slate-300">{description}</p>
        {stats.length > 0 && (
          <ul className="mt-4 space-y-1 text-xs text-slate-300/90">
            {stats.slice(0, 3).map((item) => (
              <li key={item} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />{item}</li>
            ))}
          </ul>
        )}
        <span className="mt-4 inline-block text-xs font-medium uppercase tracking-[0.2em] text-cyan-200/80">Open Module →</span>
      </div>
    </Link>
  );
}
