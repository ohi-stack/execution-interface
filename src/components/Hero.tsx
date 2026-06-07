import Link from 'next/link';

export function Hero() {
  return (
    <section className="glass-panel relative overflow-hidden p-6 sm:p-8 lg:p-12">
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_18%_0%,rgba(234,200,90,.2),transparent_32rem),radial-gradient(circle_at_90%_10%,rgba(167,139,250,.22),transparent_30rem)]" />
      <div className="relative max-w-5xl">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-gold-300 sm:tracking-[0.32em]">OMOS.OneGodian.com • Operational Intelligence • Protocol Architecture • Alignment Systems</p>
        <h1 className="mt-5 text-[clamp(2.7rem,10vw,6.8rem)] font-black leading-[0.88] tracking-[-0.07em] text-white">The OneGodian Metaphysical Operating System™</h1>
        <p className="mt-6 max-w-4xl text-lg font-semibold leading-8 text-slate-200 sm:text-2xl sm:leading-10">
          OMOS™ is the systems-architecture layer of the OneGodian ecosystem: a structured framework for identity recognition, alignment logic, protocol governance, AI interaction standards, and operational intelligence.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href="/framework" className="premium-button">Explore the OMOS Framework</Link>
          <Link href="/algorithm" className="premium-button-secondary">View the OneGodian Algorithm™</Link>
        </div>
      </div>
    </section>
  );
}
