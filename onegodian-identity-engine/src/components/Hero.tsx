import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-gold/20 bg-glow px-6 py-20 text-center shadow-luxe">
      <p className="text-xs uppercase tracking-[0.35em] text-gold">Launch edition</p>
      <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
        Monetize Identity Rituals with <span className="gold-text">ONEGODIAN IDENTITY ENGINE™</span>
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-zinc-300">
        Generate declaration cards, obsidian seals, referral-linked purchases, and HD fulfillment in one premium funnel.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/create" className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-black">
          Create Identity
        </Link>
        <Link href="/pricing" className="rounded-full border border-gold/50 px-6 py-3 text-sm font-semibold text-gold">
          View Pricing
        </Link>
      </div>
    </section>
  );
}
