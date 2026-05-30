'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import { appNavigation, ecosystemLinks } from '@/lib/onegodian-content';

export function AppFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? '';

  return (
    <div className="onegodian-surface min-h-screen text-slate-100">
      <header className="sticky top-0 z-30 border-b border-gold-300/15 bg-abyss/82 px-4 py-4 shadow-sovereign backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="inline-flex items-center gap-3 font-black tracking-[-0.03em] text-white">
              <span className="grid h-9 w-9 place-items-center rounded-full border border-gold-300/40 bg-gold-300 text-xs font-black text-abyss shadow-gold">OG</span>
              <span>
                OneGodian App
                <span className="ml-2 hidden text-xs font-semibold uppercase tracking-[0.22em] text-gold-300 sm:inline">Public / Member Node</span>
              </span>
            </Link>
            <div className="rounded-full border border-purple-300/20 bg-purple-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-purple-100">Production Dashboard</div>
          </div>

          <div className="mt-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <nav className="flex min-w-max flex-nowrap gap-2" aria-label="Main navigation">
              {appNavigation.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? 'border-gold-300/70 bg-gold-300/18 text-gold-100 shadow-gold'
                        : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-purple-300/40 hover:text-gold-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-400">
            {ecosystemLinks.map((item) => (
              <a key={item.href} href={item.href} target="_blank" rel="noreferrer" className="hover:text-gold-300">
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </header>
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-10">{children}</div>
    </div>
  );
}
