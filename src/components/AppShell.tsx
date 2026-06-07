import { Footer } from '@/components/Footer';
import { GlobalNavigation } from '@/components/GlobalNavigation';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { footerSections, appFooterBoundary } from '@/lib/app-content';
import { productionRelease } from '@/lib/production-docs';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <body className="min-h-screen overflow-x-hidden bg-obsidian text-slate-100 antialiased">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_12%_0%,rgba(124,58,237,0.28),transparent_30rem),radial-gradient(circle_at_88%_8%,rgba(234,200,90,0.18),transparent_24rem),radial-gradient(circle_at_50%_100%,rgba(167,139,250,0.12),transparent_30rem),linear-gradient(180deg,#030712_0%,#05050a_55%,#07111f_100%)]" />
      <div className="fixed inset-0 -z-10 opacity-40 [background-image:linear-gradient(rgba(234,200,90,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(167,139,250,.08)_1px,transparent_1px)] [background-size:44px_44px]" />
      <GlobalNavigation />
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {children}
      </div>
      <Footer />
      <footer className="border-t border-white/10 px-4 py-10 pb-28 md:pb-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-gold-300">{productionRelease.name}</p>
            <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white">The OneGodian App</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">Public/member-facing ecosystem access with OMOS framework, algorithm, protocol, OHI pipeline, Belief Mapper, status, health, and manifest documentation.</p>
            <p className="mt-4 text-xs leading-5 text-slate-500">{appFooterBoundary}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {footerSections.map((section) => (
              <section key={section.title}>
                <h3 className="text-xs font-black uppercase tracking-[0.18em] text-gold-200">{section.title}</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-slate-400 transition hover:text-gold-100">{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </footer>
    </body>
  );
}
