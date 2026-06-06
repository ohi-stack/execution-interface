import { Navigation } from '@/components/Navigation';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <body className="min-h-screen overflow-x-hidden bg-obsidian text-slate-100 antialiased">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_12%_0%,rgba(124,58,237,0.28),transparent_30rem),radial-gradient(circle_at_88%_8%,rgba(103,232,249,0.16),transparent_24rem),radial-gradient(circle_at_50%_100%,rgba(234,200,90,0.12),transparent_30rem),linear-gradient(180deg,#030712_0%,#05050a_55%,#07111f_100%)]" />
      <div className="fixed inset-0 -z-10 opacity-40 [background-image:linear-gradient(rgba(234,200,90,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(167,139,250,.08)_1px,transparent_1px)] [background-size:44px_44px]" />
      <Navigation />
      <div className="mx-auto w-full max-w-7xl px-4 py-6 pb-28 sm:px-6 sm:py-8 md:pb-10 lg:px-8">
        {children}
      </div>
      <footer className="border-t border-white/10 px-4 py-8 pb-28 text-center text-xs text-slate-500 md:pb-8">
        <p>The OneGodian App · Public/member-facing ecosystem access.</p>
      </footer>
    </body>
  );
}
