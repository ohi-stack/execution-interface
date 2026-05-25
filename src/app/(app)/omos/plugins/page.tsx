import { pluginRegistry } from '@/lib/plugin-registry';
export default function Page(){return <main><h1 className="text-3xl font-bold">OMOS Plugins</h1><p className="mt-3">Plugin count: {pluginRegistry.length}</p></main>}
