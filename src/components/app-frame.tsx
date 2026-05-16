'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { gregorianToOT } from '@/lib/onegodian-time';

const topNav = [
  { label: 'Dashboard', href: '/' },
  { label: 'Ecosystem', href: '/ecosystem' },
  { label: 'Registry', href: '/registry' },
  { label: 'Planets', href: '/odin/planetary-registry' },
  { label: 'ODIN', href: '/odin' },
  { label: 'Learn', href: '/learn' },
  { label: 'Identity', href: '/identity' },
  { label: 'Verification', href: '/verification' },
  { label: 'Capital', href: '/capital' },
  { label: 'Media', href: '/media' },
  { label: 'Store', href: '/store' },
  { label: 'Time', href: '/time' }
];

const mobilePrimary = [
  { icon: '🏠', label: 'Home', href: '/' },
  { icon: '🌐', label: 'Systems', href: '/ecosystem' },
  { icon: '📘', label: 'Learn', href: '/learn' },
  { icon: '🤝', label: 'Community', href: '/community' },
  { icon: '🪪', label: 'Identity', href: '/identity' }
];

export function AppFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const ot = useMemo(() => gregorianToOT(now).display, [now]);

  return (
    <div className="min-h-screen bg-slate-950 pb-20 text-slate-100 md:pb-0">
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 px-4 py-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-semibold text-cyan-300">
            OneGodian App
          </Link>
          <p className="hidden text-xs text-slate-300 sm:block">OT {ot}</p>
        </div>
        <div className="mt-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <nav className="flex min-w-max flex-nowrap gap-2" aria-label="Main navigation">
            {topNav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition ${
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
      </header>
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">{children}</div>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-700 bg-slate-950/95 p-2 backdrop-blur md:hidden"
        aria-label="Mobile navigation"
      >
        <div className="grid grid-cols-5 gap-1">
          {mobilePrimary.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-h-12 flex-col items-center justify-center rounded-lg px-2 py-1 text-[11px] ${
                  active ? 'bg-cyan-500/20 text-cyan-200' : 'text-slate-300'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
