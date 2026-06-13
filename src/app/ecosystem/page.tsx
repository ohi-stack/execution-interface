import type { Metadata } from 'next'; import { EcosystemMap } from '@/components/EcosystemMap';
export const metadata: Metadata = { title: 'Ecosystem Map', description: 'OneGodian ecosystem connection map for OMOS implementation.' };
export default function Page(){return <main className="space-y-8"><h1 className="text-5xl font-black text-white">Ecosystem Map</h1><EcosystemMap /></main>}
