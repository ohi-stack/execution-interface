import Link from 'next/link';

export function CTASection() {
  return (
    <section className="glass-panel p-6 sm:p-8">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-purple-200">Documentation Hub CTA</p>
      <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white">Build with OMOS production standards.</h2>
      <p className="mt-3 max-w-4xl leading-7 text-slate-300">
        Review the specifications, implementation map, status grid, and tool interfaces that make OMOS.OneGodian.com the dedicated systems-architecture platform for the OneGodian ecosystem.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link href="/docs" className="premium-button">Open Documentation</Link>
        <Link href="/status" className="premium-button-secondary">View System Status</Link>
      </div>
    </section>
  );
}
