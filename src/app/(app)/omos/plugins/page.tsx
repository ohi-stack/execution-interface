import { pluginRegistry } from '@/lib/plugin-registry';

export default function OmosPluginsPage() {
  return <main className="space-y-4"><h1 className="text-3xl font-bold">OMOS Plugins</h1><p className="text-slate-300">Count: {pluginRegistry.length}</p><pre className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900/50 p-4 text-xs">{JSON.stringify(pluginRegistry, null, 2)}</pre></main>;
}
