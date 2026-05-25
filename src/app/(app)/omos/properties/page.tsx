import { propertyRegistry } from '@/lib/property-registry';
export default function Page(){return <main><h1 className="text-3xl font-bold">OMOS Properties</h1><p className="mt-3">Property count: {propertyRegistry.length}</p></main>}
