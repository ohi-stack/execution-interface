import Link from 'next/link';
import { ReactNode } from 'react';
import { odinNavLinks } from './odin-nav';

export function OdinPageLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="space-y-4">
          <h1 className="text-3xl font-bold">{title}</h1>
          <nav aria-label="ODIN navigation" className="flex flex-wrap gap-2">
            {odinNavLinks.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-lg border border-cyan-500/30 bg-slate-900/70 px-3 py-2 text-sm hover:border-neon">
                {link.label}
              </Link>
            ))}
          </nav>
        </header>
        {children}
      </div>
    </main>
  );
}
