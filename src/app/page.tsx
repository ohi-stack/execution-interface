import Link from 'next/link';

const links = [
  { title: 'Ecosystem', href: '/ecosystem' },
  { title: 'OMOS', href: '/omos' },
  { title: 'Remember', href: '/remember' },
  { title: 'Membership', href: '/membership' },
  { title: 'Time', href: '/time' },
  { title: 'Commerce', href: '/commerce' },
  { title: 'Institutional', href: '/institutional' }
];

export default function HomePage() {
  return <main className="space-y-8"><section className="rounded-3xl border border-cyan-500/30 bg-slate-900/70 p-8"><p className="text-xs uppercase tracking-[0.2em] text-cyan-300">OneGodian App · Live</p><h1 className="mt-3 text-4xl font-bold">Public OneGodian App Node</h1><p className="mt-4 max-w-4xl text-slate-300">This production app provides public-safe ecosystem content, campaign access, membership entry points, time references, commerce routing, and institutional clarity.</p></section><section className="grid gap-4 md:grid-cols-2">{links.map((item) => <Link key={item.href} href={item.href} className="rounded-xl border border-slate-700 bg-slate-900/60 p-5 hover:border-cyan-400/60"><h2 className="text-xl font-semibold text-cyan-200">{item.title}</h2><p className="mt-2 text-sm text-slate-300">Open {item.href}</p></Link>)}</section></main>;
}
