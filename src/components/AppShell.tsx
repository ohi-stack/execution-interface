import Link from 'next/link';
import { accPositioning, accRepository, consoleModules } from '@/lib/acc-content';

const nav = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Agents', href: '/agents' },
  { label: 'Tasks', href: '/tasks' },
  { label: 'Workflows', href: '/workflows' },
  { label: 'Approvals', href: '/approvals' },
  { label: 'Audit', href: '/audit' },
  { label: 'Status', href: '/status' },
  { label: 'Docs', href: '/docs' }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <body>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <Link href="/" className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl border border-cyan-200/40 bg-cyan-200/10 text-sm font-black text-cyan-100 shadow-cyan">ACC</span>
              <span>
                <span className="block text-sm font-black uppercase tracking-[0.22em] text-cyan-100">{accPositioning.shortName}</span>
                <span className="block text-xs font-semibold text-slate-400">{accRepository.deployTarget}</span>
              </span>
            </Link>
            <nav aria-label="ACC primary" className="flex flex-wrap gap-2">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-full border border-white/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-200 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-white">
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
          <p>{accPositioning.boundary}</p>
          <p className="font-bold text-slate-300">{consoleModules.length} operator modules · no public/member surface</p>
        </div>
      </footer>
    </body>
  );
}
