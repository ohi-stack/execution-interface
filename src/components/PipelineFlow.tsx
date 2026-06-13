import { pipelineStages } from '@/data/pipeline';
export function PipelineFlow() { return <div className="grid gap-3 md:grid-cols-7">{pipelineStages.map((stage, i) => <div key={stage} className="rounded-2xl border border-[#D8B35A]/25 bg-white/[0.055] p-4 text-center"><p className="text-xs text-[#F0D98A]">0{i + 1}</p><h3 className="mt-2 font-black text-white">{stage}</h3></div>)}</div>; }
