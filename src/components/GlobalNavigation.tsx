import Link from 'next/link';
import { navigation, openAppUrl } from '@/data/navigation';

const controls = [
  { label: 'Search', href: '/search' },
  { label: 'System Status', href: '/status' },
  { label: 'Account', href: '/login' }
];

export function GlobalNavigation() {
  const links = <>{navigation.map((item) => <Link key={item.href} href={item.href} className="min-h-11 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-100 transition hover:border-[#D8B35A]/60 hover:text-[#F0D98A] focus:outline focus:outline-2 focus:outline-[#F0D98A]">{item.label}</Link>)}</>;
  return <header className="sticky top-0 z-50 border-b border-white/10 bg-[#071827]/85 backdrop-blur-2xl"><div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8"><Link href="/" className="flex min-h-11 items-center gap-3 focus:outline focus:outline-2 focus:outline-[#F0D98A]"><span className="grid h-12 w-12 place-items-center rounded-2xl border border-[#D8B35A]/60 bg-[#D8B35A]/10 font-black text-[#F0D98A] shadow-gold">OM</span><span><strong className="block tracking-[0.24em] text-[#F0D98A]">OMOS™</strong><small className="text-slate-300">OMOS.OneGodian.com</small></span></Link><nav aria-label="Public primary navigation" className="hidden items-center gap-2 lg:flex">{links}</nav><div className="hidden items-center gap-2 xl:flex">{controls.map(c=><Link className="min-h-11 rounded-full px-3 py-3 text-xs font-black uppercase tracking-[.12em] text-slate-200 hover:bg-white/10" href={c.href} key={c.href}>{c.label}</Link>)}<Link href={openAppUrl} className="min-h-11 rounded-full bg-[#D8B35A] px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-black shadow-gold">Open Console</Link></div><details className="group lg:hidden"><summary className="min-h-11 cursor-pointer list-none rounded-full border border-white/15 px-4 py-3 text-sm font-black text-white focus:outline focus:outline-2 focus:outline-[#F0D98A]">Menu</summary><div className="fixed inset-x-4 top-24 rounded-[2rem] border border-white/10 bg-[#071827] p-4 shadow-2xl"><nav className="grid gap-2" aria-label="Mobile navigation">{links}{controls.map(c=><Link className="min-h-11 rounded-full border border-white/10 px-4 py-3 text-sm font-black text-slate-100" href={c.href} key={c.href}>{c.label}</Link>)}<Link href={openAppUrl} className="min-h-11 rounded-full bg-[#D8B35A] px-4 py-3 text-center text-sm font-black text-black">Open Console</Link></nav></div></details></div></header>;
}
