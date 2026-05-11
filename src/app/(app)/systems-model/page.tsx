import { systemsModel } from '@/lib/onegodian-content';

export const metadata = { title: 'OneGodian App | Systems Model', description: 'Identity, ecosystem, registry, execution, and governance layers in the OneGodian app.' };

export default function SystemsModelPage() {
  return <main className="space-y-6"><header className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6"><h1 className="text-3xl font-bold">OneGodian Systems Model</h1></header>
  <section className="grid gap-3 sm:grid-cols-2">{systemsModel.map((layer)=> <article key={layer.title} className="rounded-xl border border-slate-700 bg-slate-900/60 p-4"><h2 className="font-semibold">{layer.title}</h2><ul className="mt-2 list-disc pl-5 text-sm text-slate-300">{layer.items.map((item)=><li key={item}>{item}</li>)}</ul></article>)}</section></main>;
}
