import type { Metadata } from 'next'; import { EcosystemMap } from '@/components/EcosystemMap';
export const metadata: Metadata = { title: 'Implementation Architecture', description: 'OMOS ecosystem connection map and deployment standards.' };
export default function Page(){return <main className="space-y-8"><h1 className="text-5xl font-black text-white">Implementation Architecture</h1><p className="max-w-3xl text-slate-300">Deployment standards for connecting OMOS to apps, plugins, APIs, dashboards, documentation, verification, and ecosystem platforms.</p><EcosystemMap /></main>}
