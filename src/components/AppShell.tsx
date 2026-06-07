import { Footer } from '@/components/Footer';
import { GlobalNavigation } from '@/components/GlobalNavigation';

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
    </body>
  );
}
