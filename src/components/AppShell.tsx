import Link from 'next/link';
import { appPositioning, appRepository, dashboardModules } from '@/lib/acc-content';

const nav = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Members', href: '/members' },
  { label: 'Contributors', href: '/contributors' },
  { label: 'Creators', href: '/creator-network' },
  { label: 'Products', href: '/products' },
  { label: 'Tools', href: '/tools' },
  { label: 'Ecosystem', href: '/ecosystem' }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <body>
      <header className="sticky top-0 z-50 border-b border-amber-200/10 bg-slate-950/85 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-amber-200/50 bg-amber-200/10 text-sm font-black text-amber-100 shadow-gold">OG</span>
              <span className="min-w-0">
                <span className="block text-sm font-black uppercase tracking-[0.22em] text-amber-100">{appPositioning.shortName}</span>
                <span className="block truncate text-xs font-semibold text-slate-400">{appRepository.canonicalHost}</span>
              </span>
            </Link>
            <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:justify-end lg:overflow-visible">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} className="shrink-0 rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-200 transition hover:border-amber-300/40 hover:bg-amber-300/10 hover:text-white">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>
      <div className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      <footer className="border-t border-white/10 px-4 py-8 text-sm text-slate-400 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <p>{appPositioning.boundary}</p>
          <p className="font-bold text-slate-300">{dashboardModules.length} member modules · public gateway</p>
        </div>
      </footer>
    </body>
  );
}
