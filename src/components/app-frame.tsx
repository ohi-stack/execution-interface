'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import { appNavigation, ecosystemLinks } from '@/lib/onegodian-content';

export function AppFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  return <div className="min-h-screen bg-slate-950 text-slate-100"><header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 px-4 py-4 backdrop-blur"><div className="flex items-center justify-between"><Link href="/" className="font-semibold text-cyan-300">ONEGODIAN APP · MEMBER DASHBOARD</Link></div><div className="mt-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"><nav className="flex min-w-max flex-nowrap gap-2" aria-label="Main navigation">{appNavigation.map((item) => {const active = pathname === item.href || pathname.startsWith(`${item.href}/`);return <Link key={item.href} href={item.href} className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition ${active ? 'border-cyan-400/80 bg-cyan-500/20 text-cyan-200' : 'border-slate-700 text-slate-300 hover:border-cyan-400/50 hover:text-cyan-200'}`}>{item.label}</Link>;})}</nav></div><div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-400">{ecosystemLinks.map((item) => <a key={item.href} href={item.href} target="_blank" rel="noreferrer" className="hover:text-cyan-300">{item.label}</a>)}</div></header><div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">{children}</div></div>;
}
