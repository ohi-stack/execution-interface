import { ecosystemLinks } from '@/data/ecosystem';
export function EcosystemMap() { return <div className="grid gap-4 md:grid-cols-2">{ecosystemLinks.map((link) => <article key={link.name} className="rounded-3xl border border-white/10 bg-[#0B1E2E]/70 p-5"><h3 className="font-black text-[#F0D98A]">{link.name}</h3><p className="mt-2 text-slate-300">{link.role}</p></article>)}</div>; }
