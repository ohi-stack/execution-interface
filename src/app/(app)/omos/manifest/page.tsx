import { getOmosSyncState } from '@/lib/omos-sync';
export default function Page(){const s=getOmosSyncState(); return <main><h1 className="text-3xl font-bold">OMOS Manifest</h1><pre className="mt-4 rounded-xl border border-slate-700 bg-slate-900/50 p-4 text-sm">{JSON.stringify(s.manifest ?? {status:'not-synced'},null,2)}</pre></main>}
