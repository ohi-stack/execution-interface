import { getCapitalApiStatus } from '@/lib/capital';

export default async function CapitalApiPage() {
  const data = await getCapitalApiStatus();
  return <main className="space-y-3"><h1 className="text-3xl font-semibold">Capital API</h1><p className="text-sm">API health status: {data.health}</p><p className="text-sm">API keys placeholder: Managed in secure vault (placeholder)</p><p className="text-sm">Usage this month: {data.usageThisMonth}</p><section><h2 className="font-semibold">Endpoint list</h2>{data.endpoints.map((e)=><p className="text-xs text-slate-300" key={e}>{e}</p>)}</section><p className="text-sm">Webhook logs placeholder: {data.webhookLogs}</p><section><h2 className="font-semibold">Documentation links</h2>{data.docs.map((d)=><a className="block text-cyan-300 underline" href={d.href} key={d.href}>{d.label}</a>)}</section></main>;
}
