'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { gregorianToOT } from '@/lib/onegodian-time';

const desktopNavItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Ecosystem', href: '/ecosystem' },
  { label: 'Algorithm', href: '/algorithm' },
  { label: 'Time', href: '/time' },
  { label: 'Registry', href: '/registry' },
  { label: 'Docs', href: '/docs' },
  { label: 'Planets', href: '/planets' }
];

const mobileNavItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Systems', href: '/ecosystem' },
  { label: 'Time', href: '/time' },
  { label: 'Docs', href: '/docs' }
];

function useLiveTimes() {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const utc = now.toISOString();
  const local = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const ot = useMemo(() => gregorianToOT(now).display, [now]);

  return { utc, local, ot };
}

export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { utc, local, ot } = useLiveTimes();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-slate-800/80 bg-slate-950/95 p-4 lg:block">
          <div className="mb-6 text-lg font-semibold text-cyan-300">OneGodian</div>
          <nav className="space-y-1">
            {desktopNavItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link key={item.href} href={item.href} className={`block rounded-lg px-3 py-2 text-sm ${active ? 'bg-cyan-500/20 text-cyan-200' : 'text-slate-300 hover:bg-slate-800'}`}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 px-4 py-3 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="font-semibold text-cyan-300">OneGodian</div>
              <input className="h-9 flex-1 rounded-md border border-slate-700 bg-slate-900 px-3 text-sm" placeholder="Search planets, ODIN, systems, modules..." />
              <div className="hidden text-xs text-slate-300 md:block">UTC {new Date(utc).toLocaleTimeString('en-US', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' })}</div>
              <div className="hidden text-xs text-slate-300 md:block">OT {ot}</div>
              <div className="rounded-full border border-slate-700 px-2 py-1 text-xs">🔔</div>
              <div className="rounded-full border border-slate-700 px-2 py-1 text-xs">👤</div>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-1 text-xs text-slate-300 sm:grid-cols-3">
              <span>UTC: {utc}</span>
              <span>Local: {local}</span>
              <span>OT: {ot}</span>
            </div>
          </header>

          <div className="flex-1 pb-20">{children}</div>
        </div>
      </div>

      <nav className="fixed inset-x-3 bottom-3 z-40 rounded-2xl border border-cyan-400/30 bg-slate-950/90 p-2 backdrop-blur lg:hidden">
        <ul className="grid grid-cols-4 gap-1 text-center text-[11px] text-slate-300">
          {mobileNavItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="block rounded-lg px-1 py-2 hover:bg-slate-800/80 hover:text-cyan-200">{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
