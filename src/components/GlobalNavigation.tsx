'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigation, primaryCta } from '@/data/navigation';

export function GlobalNavigation() {
  const pathname = usePathname() ?? '/';

  return (
    <header className="sticky top-0 z-50 border-b border-gold-300/20 bg-abyss/86 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="group inline-flex items-center gap-3" aria-label="OMOS home">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-gold-300/60 bg-gradient-to-br from-gold-200 to-sovereign text-xs font-black text-obsidian shadow-gold">OM</span>
            <span>
              <span className="block text-sm font-black uppercase tracking-[0.24em] text-gold-100">OMOS</span>
              <span className="block text-xs font-semibold text-slate-400 group-hover:text-gold-200">OneGodian Metaphysical Operating System™</span>
            </span>
          </Link>
          <Link href={primaryCta.href} className="premium-button">
            {primaryCta.label} →
          </Link>
        </div>
        <nav aria-label="Global navigation" className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navigation.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-full border px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] transition ${
                  active
                    ? 'border-gold-300/70 bg-gold-300/15 text-gold-100 shadow-gold'
                    : 'border-white/10 bg-white/[0.035] text-slate-300 hover:border-purple-300/45 hover:text-purple-100'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
