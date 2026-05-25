import { getOmosSyncState } from '@/lib/omos-sync';
export default function Page(){const s=getOmosSyncState(); return <main><h1 className="text-3xl font-bold">OMOS Health</h1><p className="mt-3">Runtime status: {String(s.health?.status ?? 'unknown')}</p></main>}
