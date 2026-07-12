import { qrvNetwork } from '@/data/capital-products';

export default function Page() {
  return <main className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6"><p className="text-xs font-black uppercase tracking-[0.24em] text-[#F0D98A]">QRV Network Verification</p><h1 className="mt-3 text-4xl font-black text-white">Verification layer</h1><p className="mt-4 max-w-4xl text-lg leading-8 text-slate-300">Verification references for ONEGODIAN Capital, Zolfi, and INSTRYX resolve through {qrvNetwork.verification}, with registry proofs coordinated at {qrvNetwork.registry}.</p></main>;
}
