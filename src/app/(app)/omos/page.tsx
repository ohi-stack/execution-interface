import { getOmosBridgeConfig } from '@/lib/omos-bridge';

const restEndpoints = ['/api/omos/status', '/api/manifest', '/api/tools', '/api/stats', '/api/omos/llm/chat'];

export default function OmosPage() {
  const config = getOmosBridgeConfig();
  return <main className="space-y-6"><header className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6"><h1 className="text-3xl font-bold">OMOS Module</h1><p className="mt-2 text-slate-300">OMOS.OneGodian.com protocol status, bridge operations, tool registry, and gateway telemetry placeholders.</p></header>
  <section className="grid gap-4 md:grid-cols-2"><article className="rounded-xl border border-slate-700 bg-slate-900/60 p-4"><h2 className="font-semibold">Provider / Bridge Configuration</h2><ul className="mt-2 space-y-1 text-sm text-slate-300"><li>OMOS_REST_BASE_URL: {config.restBaseUrl ?? 'not set'}</li><li>X-OMOS-App-Key: {config.hasBridgeKey ? 'configured (server-side only)' : 'missing'}</li><li>OMOS LLM Gateway: placeholder monitored</li><li>Tool Registry: placeholder data loaded</li></ul></article><article className="rounded-xl border border-slate-700 bg-slate-900/60 p-4"><h2 className="font-semibold">REST Endpoints</h2><ul className="mt-2 list-disc pl-5 text-sm text-cyan-300">{restEndpoints.map((ep)=><li key={ep}>{ep}</li>)}</ul></article></section></main>;
}
