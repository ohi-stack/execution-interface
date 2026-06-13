import type { Metadata } from 'next'; import { PipelineFlow } from '@/components/PipelineFlow';
export const metadata: Metadata = { title: 'OHI Output Pipeline', description: 'Source prompt to governed output through model comparison and OMOS normalization.' };
export default function Page(){return <main className="space-y-8"><h1 className="text-5xl font-black text-white">OHI Output Pipeline™</h1><p className="max-w-3xl text-slate-300">Multiple model outputs are compared, distilled, synthesized, and normalized into disciplined OneGodian operational intelligence.</p><PipelineFlow /></main>}
