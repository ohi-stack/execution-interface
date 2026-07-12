import Link from 'next/link';
import { capitalDisclosure, capitalProducts, qrvNetwork } from '@/data/capital-products';

type ProductKey = keyof typeof capitalProducts;

const routeLabels: Record<string, string> = {
  '/zolfi/security': 'Blockchain security',
  '/zolfi/contracts': 'Smart contract intelligence',
  '/zolfi/verification': 'Post-quantum readiness verification',
  '/zolfi/research': 'Security research',
  '/instryx/requests': 'Readiness requests',
  '/instryx/approvals': 'Approvals workflow',
  '/instryx/issuance': 'Issuance analytics',
  '/instryx/audit': 'Execution audit',
  '/instryx/trace': 'Trace intelligence'
};

export function CapitalProductPage({ productKey, route }: { productKey: ProductKey; route: string }) {
  const product = capitalProducts[productKey];
  const isRoot = route === product.routes[0];
  const routeTitle = isRoot ? product.name : routeLabels[route] ?? product.name;

  return (
    <main className="space-y-8">
      <section className="rounded-[2rem] border border-amber-200/30 bg-amber-300/10 p-6 md:p-8">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#F0D98A]">ONEGODIAN Capital Product Line</p>
        <h1 className="mt-3 text-4xl font-black text-white md:text-6xl">{routeTitle}</h1>
        <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-200">{product.description}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={`https://${product.publicUrl}`} className="rounded-full bg-[#D8B35A] px-5 py-3 text-sm font-black text-black shadow-gold">{product.cta}</a>
          <Link href="/verify" className="rounded-full border border-white/15 px-5 py-3 text-sm font-black text-white">Verify proof</Link>
          <Link href="/registry" className="rounded-full border border-white/15 px-5 py-3 text-sm font-black text-white">Open registry</Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {product.modules.map((module) => (
          <article key={module} className="rounded-3xl border border-white/10 bg-white/[0.055] p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Capital module</p>
            <h2 className="mt-2 text-2xl font-black text-white">{module}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">Standardized for ONEGODIAN Capital with QRV-backed API, verification, registry, monitoring, and developer documentation references.</p>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-purple-300/25 bg-purple-400/10 p-5">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-purple-100">QRV Network infrastructure layer</p>
        <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2 xl:grid-cols-3">
          <div><dt className="font-black text-white">API/backend</dt><dd className="text-slate-300">{qrvNetwork.api}</dd></div>
          <div><dt className="font-black text-white">Developer docs</dt><dd className="text-slate-300">{qrvNetwork.developerDocs}</dd></div>
          <div><dt className="font-black text-white">Monitoring</dt><dd className="text-slate-300">{qrvNetwork.status}</dd></div>
          <div><dt className="font-black text-white">Verification</dt><dd className="text-slate-300">{qrvNetwork.verification}</dd></div>
          <div><dt className="font-black text-white">Registry/proof layer</dt><dd className="text-slate-300">{qrvNetwork.registry}</dd></div>
          <div><dt className="font-black text-white">Source reference</dt><dd className="text-slate-300">{product.sourceReference}</dd></div>
        </dl>
        <p className="mt-5 text-sm leading-6 text-slate-300">{capitalDisclosure}</p>
      </section>
    </main>
  );
}
