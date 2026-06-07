import Link from 'next/link';
import { classificationNotice } from '@/data/omos-pages';
import { navigation, primaryCta } from '@/data/navigation';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-abyss/70 px-4 py-10 text-sm text-slate-400 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-gold-300">Footer Classification Notice</p>
          <p className="mt-3 max-w-4xl leading-7">{classificationNotice}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="font-black uppercase tracking-[0.16em] text-slate-200">Navigate</p>
            <div className="mt-3 grid gap-2">
              {navigation.slice(0, 5).map((item) => <Link key={item.href} href={item.href} className="hover:text-gold-100">{item.label}</Link>)}
            </div>
          </div>
          <div>
            <p className="font-black uppercase tracking-[0.16em] text-slate-200">Operate</p>
            <div className="mt-3 grid gap-2">
              {navigation.slice(5).map((item) => <Link key={item.href} href={item.href} className="hover:text-gold-100">{item.label}</Link>)}
              <Link href={primaryCta.href} className="text-gold-200 hover:text-gold-100">{primaryCta.label} →</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
