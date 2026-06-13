import type { Metadata } from 'next'; import { StatusGrid } from '@/components/StatusGrid';
export const metadata: Metadata = { title: 'Status Dashboard', description: 'Operational status for OMOS modules and APIs.' };
export default function Page(){return <main className="space-y-8"><h1 className="text-5xl font-black text-white">Status Dashboard</h1><StatusGrid /></main>}
