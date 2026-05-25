import Link from 'next/link';
import { appSitemap, type SitemapStatus } from '@/lib/app-sitemap';

const badgeTone: Record<SitemapStatus, string> = {
  live: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
  planned: 'bg-amber-500/20 text-amber-100 border-amber-400/40',
  internal: 'bg-slate-500/20 text-slate-200 border-slate-300/30',
  external: 'bg-cyan-500/20 text-cyan-100 border-cyan-300/40'
};

const grouped = Object.entries(appSitemap.reduce<Record<string, typeof appSitemap>>((acc, item) => {
  acc[item.group] ||= [];
  acc[item.group].push(item);
  return acc;
}, {}));

export default function SitemapPage() {
  return <main className="space-y-6"><header><h1 className="text-3xl font-bold">App Sitemap</h1><p className="text-slate-300">Public/member-facing route map for app.onegodian.com.</p></header><section className="grid gap-4 md:grid-cols-2">{grouped.map(([group, items]) => <article key={group} className="rounded-xl border border-slate-700 bg-slate-900/50 p-4"><h2 className="text-xl font-semibold">{group}</h2><ul className="mt-3 space-y-3">{items.map((item) => <li key={item.path}><div className="flex items-center gap-2"><Link href={item.path} className="font-medium text-cyan-300 hover:underline">{item.title}</Link><span className={`rounded-full border px-2 py-0.5 text-xs ${badgeTone[item.status]}`}>{item.status}</span></div><p className="text-sm text-slate-300">{item.description}</p>{item.children?.length ? <ul className="mt-2 list-disc pl-5 text-sm text-slate-200">{item.children.map((child) => <li key={child.path}><Link href={child.path} className="text-cyan-200 hover:underline">{child.title}</Link></li>)}</ul> : null}</li>)}</ul></article>)}</section></main>;
}
