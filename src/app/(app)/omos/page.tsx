import { getOmosDashboardData } from '@/lib/omos-bridge';

function StatusPill({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
        active
          ? 'border-emerald-400/50 bg-emerald-500/10 text-emerald-200'
          : 'border-amber-400/50 bg-amber-500/10 text-amber-200'
      }`}
    >
      {label}
    </span>
  );
}

function ErrorBox({ title, error }: { title: string; error?: string }) {
  return (
    <div className="rounded-xl border border-red-500/30 bg-red-950/30 p-4">
      <h3 className="font-semibold text-red-200">{title}</h3>
      <p className="mt-2 text-sm text-red-100/80">{error || 'Connection unavailable. Confirm the plugin is installed, the bridge is enabled, and the app key is set.'}</p>
    </div>
  );
}

export default async function OmosPage() {
  const data = await getOmosDashboardData();
  const providers = data.providers.data?.items || data.manifest.data?.llmGateway?.providers || [];
  const tools = data.tools.data || [];
  const gateway = data.manifest.data?.llmGateway;
  const endpoints = data.manifest.data?.restEndpoints || gateway?.endpoints || [];

  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-cyan-400/30 bg-slate-900/70 p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">OMOS · ONEGODIAN APP BRIDGE</p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">OMOS Bridge + LLM Gateway</h1>
            <p className="mt-4 max-w-4xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Connected dashboard for the OMO / OMOS WordPress plugin, app manifest, tool registry, submission telemetry, and the secure multi-provider LLM gateway.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusPill active={data.environment.hasBridgeKey} label={data.environment.hasBridgeKey ? 'App Key Set' : 'App Key Missing'} />
            <StatusPill active={Boolean(gateway?.enabled)} label={gateway?.enabled ? 'LLM Gateway Enabled' : 'LLM Gateway Disabled'} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Plugin</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{data.status.data?.version || data.manifest.data?.version || 'Pending'}</h2>
          <p className="mt-2 text-sm text-slate-300">OMOS Core Tools version detected from WordPress.</p>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Tools</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{tools.length}</h2>
          <p className="mt-2 text-sm text-slate-300">Plugin tools available through the app bridge.</p>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Submissions</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{data.stats.data?.total ?? '—'}</h2>
          <p className="mt-2 text-sm text-slate-300">Logged OMOS records and generator submissions.</p>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">LLM Providers</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{gateway?.configuredProviders ?? providers.filter((p) => p.configured).length}</h2>
          <p className="mt-2 text-sm text-slate-300">Configured providers available to OMOS.</p>
        </article>
      </section>

      {(!data.status.ok || !data.manifest.ok) && (
        <section className="grid gap-4 md:grid-cols-2">
          {!data.status.ok && <ErrorBox title="Status endpoint unavailable" error={data.status.error} />}
          {!data.manifest.ok && <ErrorBox title="Manifest endpoint unavailable" error={data.manifest.error} />}
        </section>
      )}

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h2 className="text-xl font-semibold text-white">LLM Gateway Providers</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            Provider keys stay in WordPress. The OneGodian App uses the OMOS bridge key server-side and should never expose provider keys in the browser.
          </p>
          <div className="mt-4 grid gap-3">
            {providers.length === 0 ? (
              <p className="text-sm text-slate-400">Provider list pending. Install OMOS Core Tools v1.2.0 and enable the LLM Gateway.</p>
            ) : (
              providers.map((provider) => (
                <div key={provider.slug} className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold text-slate-100">{provider.name}</h3>
                    <StatusPill active={provider.configured} label={provider.configured ? 'Configured' : 'Needs Key'} />
                  </div>
                  <p className="mt-2 text-xs text-slate-400">{provider.slug} · {provider.type}</p>
                  <p className="mt-1 text-xs text-slate-400">Model: {provider.model || 'Not set'}</p>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h2 className="text-xl font-semibold text-white">OMOS Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">Tool registry exposed from the WordPress plugin for app cards and future action workflows.</p>
          <div className="mt-4 grid gap-3">
            {tools.length === 0 ? (
              <p className="text-sm text-slate-400">Tool list pending. Confirm /wp-json/omos/v1/tools is reachable.</p>
            ) : (
              tools.map((tool) => (
                <div key={tool.slug || tool.id || tool.title || tool.name} className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
                  <h3 className="font-semibold text-slate-100">{tool.title || tool.name || tool.slug}</h3>
                  {tool.description && <p className="mt-2 text-sm text-slate-300">{tool.description}</p>}
                  {tool.shortcode && <p className="mt-2 text-xs text-cyan-200">{tool.shortcode}</p>}
                </div>
              ))
            )}
          </div>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h2 className="text-xl font-semibold text-white">Connection Settings</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div><dt className="text-slate-400">API Base URL</dt><dd className="break-all text-slate-100">{data.environment.apiBaseUrl}</dd></div>
            <div><dt className="text-slate-400">Module Slug</dt><dd className="text-slate-100">{data.environment.moduleSlug}</dd></div>
            <div><dt className="text-slate-400">Dashboard URL</dt><dd className="break-all text-slate-100">{data.environment.appDashboardUrl}</dd></div>
            <div><dt className="text-slate-400">Default LLM Provider</dt><dd className="text-slate-100">{gateway?.defaultProvider || 'Not detected'}</dd></div>
          </dl>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h2 className="text-xl font-semibold text-white">REST Endpoints</h2>
          <div className="mt-4 space-y-2">
            {endpoints.length === 0 ? (
              <p className="text-sm text-slate-400">Manifest endpoints pending.</p>
            ) : (
              endpoints.map((endpoint) => (
                <code key={endpoint} className="block break-all rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-cyan-100">
                  {endpoint}
                </code>
              ))
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
