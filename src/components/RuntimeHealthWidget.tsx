'use client';

import { useEffect, useState } from 'react';

type RuntimeState = {
  loading: boolean;
  online: boolean;
  status: string;
  version: string;
  runtimeName: string;
  availability: string;
  error?: string;
};

function pickString(source: unknown, keys: string[], fallback: string) {
  if (!source || typeof source !== 'object') return fallback;
  const record = source as Record<string, unknown>;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value;
  }
  return fallback;
}

export function RuntimeHealthWidget() {
  const [state, setState] = useState<RuntimeState>({ loading: true, online: false, status: 'Checking', version: 'Unknown', runtimeName: 'OMOS Runtime', availability: 'Checking live availability' });

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 8000);

    async function loadRuntime() {
      try {
        const [healthResult, manifestResult] = await Promise.allSettled([
          fetch('https://omos.onegodian.com/health', { cache: 'no-store', signal: controller.signal }),
          fetch('https://omos.onegodian.com/manifest', { cache: 'no-store', signal: controller.signal })
        ]);

        const health = healthResult.status === 'fulfilled' && healthResult.value.ok ? await healthResult.value.json() : null;
        const manifest = manifestResult.status === 'fulfilled' && manifestResult.value.ok ? await manifestResult.value.json() : null;
        const online = Boolean(health || manifest);

        setState({
          loading: false,
          online,
          status: pickString(health, ['status', 'state', 'health'], online ? 'Online' : 'Offline'),
          version: pickString(manifest, ['version', 'runtime_version', 'app_version'], pickString(health, ['version'], 'Unknown')),
          runtimeName: pickString(manifest, ['name', 'runtime', 'runtimeName', 'app'], 'OMOS Runtime'),
          availability: online ? 'Live sync available' : 'Live sync unavailable',
          error: online ? undefined : 'OMOS did not return a live response. Showing graceful offline state.'
        });
      } catch {
        setState({ loading: false, online: false, status: 'Offline', version: 'Unknown', runtimeName: 'OMOS Runtime', availability: 'Unavailable', error: 'OMOS is currently unreachable from this browser session.' });
      } finally {
        window.clearTimeout(timer);
      }
    }

    loadRuntime();
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, []);

  return (
    <section className="glass-panel p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-200">OMOS Sync</p>
          <h2 className="mt-2 text-2xl font-black text-white">Runtime health</h2>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${state.online ? 'border-emerald-300/40 bg-emerald-300/10 text-emerald-100' : 'border-orange-300/40 bg-orange-300/10 text-orange-100'}`}>
          {state.loading ? 'Loading' : state.status}
        </span>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Runtime', state.runtimeName],
          ['Version', state.version],
          ['Availability', state.availability],
          ['Health URL', 'omos.onegodian.com/health']
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-slate-500">{label}</p>
            <p className="mt-2 break-words text-sm font-bold text-slate-100">{state.loading ? 'Loading…' : value}</p>
          </div>
        ))}
      </div>
      {state.error ? <p className="mt-4 rounded-2xl border border-orange-300/25 bg-orange-300/10 p-3 text-sm text-orange-100">{state.error}</p> : null}
    </section>
  );
}
