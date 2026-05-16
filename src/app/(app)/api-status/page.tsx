import { apiStatus } from '@/lib/onegodian-content';
export default function ApiStatusPage(){return <main className="space-y-4"><h1 className="text-3xl font-bold">API RUNTIME</h1><pre className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 text-sm">{JSON.stringify(apiStatus,null,2)}</pre></main>}
