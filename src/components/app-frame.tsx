'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { gregorianToOT } from '@/lib/onegodian-time';

const navItems = [
  { label: 'Dashboard', href: '/' },
  { label: 'Ecosystem', href: '/ecosystem' },
  { label: 'Registry', href: '/registry' },
  { label: 'Games', href: '/games' },
  { label: 'Tools', href: '/tools' },
  { label: 'Planets', href: '/planets' },
  { label: 'Products', href: '/products' },
  { label: 'Certificates', href: '/certificates' },
  { label: 'Media', href: '/media' },
  { label: 'Profile', href: '/profile' }
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
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="font-semibold text-cyan-300">OneGodian</div>
          <div className="hidden text-xs text-slate-300 md:block">UTC {new Date(utc).toLocaleTimeString('en-US', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' })}</div>
          <div className="hidden text-xs text-slate-300 md:block">OT {ot}</div>
        </div>
        <div className="mt-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <nav className="flex min-w-max items-center gap-2 pb-1" aria-label="Main navigation">
            {navItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex h-11 items-center rounded-full border px-4 text-sm transition ${
                    active
                      ? 'border-cyan-400/80 bg-cyan-500/20 text-cyan-200'
                      : 'border-slate-700 text-slate-300 hover:border-cyan-400/50 hover:text-cyan-200'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mt-2 grid grid-cols-1 gap-1 text-xs text-slate-300 sm:grid-cols-3">
          <span>UTC: {utc}</span>
          <span>Local: {local}</span>
          <span>OT: {ot}</span>
        </div>
      </header>
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
