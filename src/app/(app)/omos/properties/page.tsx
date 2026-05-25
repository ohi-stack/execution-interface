import { propertyRegistry } from '@/lib/property-registry';

export default function OmosPropertiesPage() {
  return <main className="space-y-4"><h1 className="text-3xl font-bold">OMOS Properties</h1><p className="text-slate-300">Count: {propertyRegistry.length}</p><pre className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900/50 p-4 text-xs">{JSON.stringify(propertyRegistry, null, 2)}</pre></main>;
}
