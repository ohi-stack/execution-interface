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
  cyan: 'from-cyan-300/70 to-purple-400/20 border-cyan-300/30 text-cyan-100',
  gold: 'from-gold-300/85 to-gold-500/25 border-gold-300/45 text-gold-100',
  violet: 'from-purple-300/75 to-royal/25 border-purple-300/40 text-purple-100',
  emerald: 'from-emerald-300/75 to-emerald-600/20 border-emerald-300/35 text-emerald-100',
  magenta: 'from-fuchsia-300/75 to-purple-600/25 border-fuchsia-300/35 text-fuchsia-100',
  orange: 'from-orange-300/80 to-gold-500/25 border-orange-300/35 text-orange-100',
  red: 'from-red-300/75 to-red-600/20 border-red-300/35 text-red-100',
  silver: 'from-slate-200/70 to-slate-500/20 border-slate-200/30 text-slate-100'
};

function Glyph({ glyph = 'dashboard' }: { glyph?: ModuleCardProps['glyph'] }) {
  const common = 'h-14 w-14 stroke-[1.35] text-gold-200/75 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3';
  if (glyph === 'planet') return <svg viewBox="0 0 24 24" fill="none" className={common}><circle cx="12" cy="12" r="4.5" /><ellipse cx="12" cy="12" rx="9" ry="3.2" /><path d="M3 14c1.8 1.2 4.2 2 9 2s7.2-.8 9-2" /></svg>;
  if (glyph === 'moons') return <svg viewBox="0 0 24 24" fill="none" className={common}><circle cx="12" cy="12" r="2.8" /><circle cx="6.5" cy="8" r="1.6" /><circle cx="18" cy="15.5" r="1.8" /><path d="M4 12a8 8 0 0 1 8-8" /><path d="M20 12a8 8 0 0 1-8 8" /></svg>;
  if (glyph === 'ecosystem') return <svg viewBox="0 0 24 24" fill="none" className={common}><circle cx="6" cy="7" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="12" cy="17" r="2" /><path d="M7.8 8.1 10.2 15" /><path d="M16.2 7.1 13.8 15" /><path d="M8 7h8" /></svg>;
  return <svg viewBox="0 0 24 24" fill="none" className={common}><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M8 9h8M8 13h8M8 17h5" /></svg>;
}

export function ModuleCard({ title, description, href = '#', accent = 'gold', stats = [], glyph = 'dashboard', featured = false }: ModuleCardProps) {
  return (
    <Link href={href} className={`mobile-card group ${featured ? 'sm:col-span-2 lg:col-span-1 lg:min-h-64' : ''}`}>
      <div className="absolute right-3 top-3 opacity-90"><Glyph glyph={glyph} /></div>
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accentStyles[accent].split(' ').slice(0, 2).join(' ')}`} />
      <div className="relative">
        <h3 className="max-w-[82%] text-lg font-bold text-white">{title}</h3>
        <p className="mt-2 max-w-[88%] text-sm leading-6 text-slate-300">{description}</p>
        {stats.length > 0 && (
          <ul className="mt-4 space-y-2 text-xs text-slate-300/95">
            {stats.slice(0, 3).map((item) => (
              <li key={item} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-gold-300" />{item}</li>
            ))}
          </ul>
        )}
        <span className="mt-5 inline-block text-xs font-black uppercase tracking-[0.22em] text-gold-300">Open Module →</span>
      </div>
    </Link>
  );
}
