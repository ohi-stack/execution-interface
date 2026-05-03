import { OdinPageLayout } from '@/components/odin/OdinPageLayout';
import { OdinPlanetRegistryTable } from '@/components/odin/OdinWidgets';

export default function OdinPlanetaryRegistryPage() {
  return <OdinPageLayout title='ODIN-PR Planetary Registry'><OdinPlanetRegistryTable /></OdinPageLayout>;
}
import { OdinPlanetRegistryTable } from '@/components/odin/OdinWidgets';
export default function OdinPlanetaryRegistryPage() { return <main className='min-h-screen px-6 py-10'><div className='mx-auto max-w-7xl'><h1 className='mb-6 text-3xl font-bold'>ODIN-PR Planetary Registry</h1><OdinPlanetRegistryTable /></div></main>; }
