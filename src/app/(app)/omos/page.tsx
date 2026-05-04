import { getOmosBridgeConfig } from '@/lib/omos-bridge';

export default function OmosPage() {
  const config = getOmosBridgeConfig();

  return (
    <main className="min-h-screen px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-5xl space-y-6">
        <h1 className="text-3xl font-semibold">OMOS</h1>
        <p className="text-slate-300">Operational Module Operating System bridge dashboard for plugin-integrated module operations.</p>
        <section className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
          <h2 className="text-lg font-medium">Bridge Configuration</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>OMOS_REST_BASE_URL: {config.restBaseUrl ?? 'not set'}</li>
            <li>OMOS_API_BASE_URL: {config.apiBaseUrl ?? 'not set'}</li>
            <li>OMOS_MODULE_SLUG: {config.moduleSlug}</li>
            <li>OMOS_APP_BRIDGE_KEY: {config.hasBridgeKey ? 'configured' : 'not set'}</li>
            <li>Bridge Route: /api/omos/llm/chat</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
