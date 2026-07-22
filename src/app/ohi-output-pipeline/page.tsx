import type { Metadata } from 'next';
import { OhiCycleSimulator } from '@/components/OhiCycleSimulator';

export const metadata: Metadata = {
  title: 'OHI Output Pipeline',
  description: 'Interactive public-safe simulator for the OHI cross-model review cycle.',
};

export default function Page() {
  return <main className="space-y-8"><OhiCycleSimulator /></main>;
}
