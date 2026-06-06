import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl py-12 text-center sm:py-20">
      <section className="glass-panel p-6 sm:p-10">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-gold-300">404</p>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">Page not found</h1>
        <p className="mt-4 text-slate-300">This public/member app route is not available. Return to the dashboard or explore the ecosystem.</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/dashboard" className="premium-button">Open Dashboard</Link>
          <Link href="/ecosystem" className="premium-button-secondary">Explore Ecosystem</Link>
        </div>
      </section>
    </main>
  );
}
