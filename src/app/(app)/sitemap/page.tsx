import Link from 'next/link';
import { appSitemap } from '@/lib/app-sitemap';

export default function SitemapPage() {
  return <main className="space-y-5"><h1 className="text-3xl font-bold">OneGodian App Sitemap</h1><p className="text-slate-300">Public/member-facing routes only for app.onegodian.com. Console/admin/operator surfaces stay on console.onegodian.com.</p><div className="space-y-4">{appSitemap.map((r)=><section key={r.path} className="rounded-xl border border-slate-700 bg-slate-900/50 p-4"><div className="flex items-center justify-between"><Link className="text-cyan-300" href={r.path}>{r.title} · {r.path}</Link><span className="text-xs text-slate-400">{r.group}</span></div><p className="text-sm text-slate-300">{r.description}</p>{r.children?.length ? <ul className="mt-2 list-disc pl-5 text-sm text-slate-300">{r.children.map((c)=><li key={c.path}><Link href={c.path} className="text-cyan-300">{c.path}</Link> — {c.description}</li>)}</ul> : null}</section>)}</div></main>;
}
