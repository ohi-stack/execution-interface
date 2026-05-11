'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import { appNavigation } from '@/lib/onegodian-content';

const mobileNav = appNavigation.slice(0, 5).map((item) => ({ ...item, icon: '•' }));

export function AppFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return <div className="min-h-screen bg-slate-950 pb-20 text-slate-100 md:pb-0">
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 px-4 py-4 backdrop-blur">
      <Link href="/" className="font-semibold text-cyan-300">OneGodian App</Link>
      <nav className="mt-3 hidden gap-2 md:flex md:flex-wrap">
        {appNavigation.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return <Link key={item.href} href={item.href} className={`rounded-full border px-3 py-1 text-sm ${active ? 'border-cyan-400/80 bg-cyan-500/20 text-cyan-200' : 'border-slate-700 text-slate-300'}`}>{item.label}</Link>;
        })}
      </nav>
    </header>
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">{children}</div>
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-700 bg-slate-950/95 p-2 md:hidden"><div className="grid grid-cols-5 gap-1">{mobileNav.map((item) => <Link key={item.href} href={item.href} className="text-center text-xs text-slate-300">{item.label}</Link>)}</div></nav>
  </div>;
}
