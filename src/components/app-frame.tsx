'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import { appBoundaryCopy, appNavigation, ecosystemLinks, footerSections } from '@/lib/onegodian-content';

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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 px-4 py-4 backdrop-blur">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="font-semibold text-cyan-300">OneGodian App · Public/Member Node</Link>
            <Link href="/status" className="rounded-full border border-emerald-400/50 px-3 py-1 text-xs font-semibold text-emerald-200">Status: Live</Link>
          </div>
          <div className="mt-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <nav className="flex min-w-max flex-nowrap gap-2" aria-label="Main navigation">
              {appNavigation.map((item) => {
                const active = item.href === '/' ? pathname === '/' : pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link key={item.href} href={item.href} className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition ${active ? 'border-cyan-400/80 bg-cyan-500/20 text-cyan-200' : 'border-slate-700 text-slate-300 hover:border-cyan-400/50 hover:text-cyan-200'}`}>
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
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-400">
            {ecosystemLinks.map((item) => (
              <a key={item.href} href={item.href} target="_blank" rel="noreferrer" className="hover:text-cyan-300">{item.label}</a>
            ))}
          </div>
        </div>
      </header>
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-10">{children}</div>
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">{children}</div>
      <footer className="border-t border-slate-800 bg-slate-950 px-4 py-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-4">
          {footerSections.map((section) => (
            <section key={section.title}>
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">{section.title}</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {section.links.map((link) => (
                  <li key={link.href}>
                    {link.href.startsWith('http') ? (
                      <a href={link.href} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-cyan-300">{link.label}</a>
                    ) : (
                      <Link href={link.href} className="text-slate-300 hover:text-cyan-300">{link.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-7xl text-xs leading-5 text-slate-500">{appBoundaryCopy}</p>
      </footer>
    </div>
  );
}
