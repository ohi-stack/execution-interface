import { getOmosSyncState } from '@/lib/omos-sync';
export default function Page(){const s=getOmosSyncState(); return <main className="space-y-3"><h1 className="text-3xl font-bold">OMOS Pages</h1><p>{s.pages.length} synced page entries.</p></main>}
