'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import appPages from '@/data/app-pages.json';

const bottomTabs = [
  { label: 'Home', href: '/', icon: '⌂' },
  { label: 'Systems', href: '/odin', icon: '◎' },
  { label: 'Learn', href: '/learn', icon: '✦' },
  { label: 'Community', href: '/membership', icon: '◇' },
  { label: 'Identity', href: '/identity', icon: '◈' }
];

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navigation() {
  const pathname = usePathname() || '/';
  const primary = appPages.navigation;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-obsidian/80 backdrop-blur-2xl">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="The OneGodian App home">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-gold-300/45 bg-gradient-to-br from-gold-200 via-gold-400 to-purple-400 text-sm font-black text-obsidian shadow-gold">OG</span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-black uppercase tracking-[0.2em] text-gold-100 sm:text-base">OneGodian</span>
              <span className="block truncate text-xs text-slate-400">Public/member app</span>
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
            {primary.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`rounded-full px-2.5 py-2 text-xs font-semibold transition xl:px-3 xl:text-sm ${
                  isActive(pathname, item.path)
                    ? 'border border-gold-300/45 bg-gold-300/15 text-gold-100'
                    : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-3 sm:px-6 lg:hidden" aria-label="Section navigation">
          {appPages.navigation.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`shrink-0 rounded-full border px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] transition ${
                isActive(pathname, item.path)
                  ? 'border-gold-300/55 bg-gold-300/15 text-gold-100'
                  : 'border-white/10 bg-white/[0.04] text-slate-300'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-obsidian/92 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur-2xl md:hidden" aria-label="Mobile bottom navigation">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {bottomTabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`rounded-2xl px-1 py-2 text-center text-[0.68rem] font-bold transition ${
                isActive(pathname, tab.href) ? 'bg-gold-300/15 text-gold-100' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="block text-lg leading-none">{tab.icon}</span>
              <span className="mt-1 block truncate">{tab.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
