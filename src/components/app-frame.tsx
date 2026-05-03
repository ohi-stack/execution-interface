'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { gregorianToOT } from '@/lib/onegodian-time';

const navItems = [
  { label: 'Dashboard', href: '/' },
  { label: 'Ecosystem', href: '/ecosystem' },
  { label: 'Onegodian Algorithm', href: '/algorithm' },
  { label: 'Protocol Layer', href: '/algorithm/protocol' },
  { label: 'Experience Layer', href: '/algorithm/experience' },
  { label: 'Community Layer', href: '/algorithm/community' },
  { label: 'Orientation Layer', href: '/algorithm/orientation' },
  { label: 'Belief Mapper Lite', href: '/belief-mapper' },
  { label: 'Learn', href: '/learn' },
  { label: 'OneGodian U', href: 'https://u.onegodian.org' },
  { label: 'Divine 9 Covers', href: '/media/divine-9' },
  { label: 'Visual Cover Standards', href: '/standards/visual-covers' },
  { label: 'Institutional Dossier', href: '/institutional' }
  { label: 'Registry', href: '/registry' },
  { label: 'Systems', href: '/systems' },
  { label: 'Members', href: '/members' },
  { label: 'Capital', href: '/capital' },
  { label: 'Media', href: '/media' },
  { label: 'Tools', href: '/tools' },
  { label: 'Galaxy', href: '/galaxy' },
  { label: 'Developers', href: '/developers' }
];

const liveStatusItems = [
  'Dashboard Runtime Active',
  'Registry Connected',
  'Membership Layer Online',
  'Capital Layer Staging',
  'OMOS Tools Active',
  'API Layer Syncing'
];

const mobilePrimary = [
  { icon: '🏠', label: 'Dashboard', href: '/' },
  { icon: '🌐', label: 'Ecosystem', href: '/ecosystem' },
  { icon: '🪪', label: 'Registry', href: '/registry' },
  { icon: '⚙️', label: 'Systems', href: '/systems' },
  { icon: '☰', label: 'More', href: '/developers' }
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

export function AppFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { utc, local, ot } = useLiveTimes();

  return (
    <div className="min-h-screen bg-slate-950 pb-20 text-slate-100 md:pb-0">
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 px-4 py-3 backdrop-blur">
        <div className="rounded-xl border border-cyan-500/40 bg-slate-900/80 px-3 py-2 text-xs text-cyan-100">
          <span className="mr-2 font-semibold text-cyan-300">LIVE SYSTEM STATUS</span>
          <div className="mt-1 flex flex-wrap gap-2">
            {liveStatusItems.map((item) => (
              <span key={item} className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-2 py-0.5">● {item}</span>
            ))}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
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

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-700 bg-slate-950/95 p-2 backdrop-blur md:hidden" aria-label="Mobile navigation">
        <div className="grid grid-cols-5 gap-1">
          {mobilePrimary.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} href={item.href} className={`flex flex-col items-center rounded-lg px-2 py-1 text-[11px] ${active ? 'bg-cyan-500/20 text-cyan-200' : 'text-slate-300'}`}>
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
