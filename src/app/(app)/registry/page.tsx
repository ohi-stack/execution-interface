import { AppShell } from '@/components/app-shell';

export default function RegistryPage() {
  return <AppShell title="ODIN Registry" modules={[{ title: 'ODIN Registry™', description: 'Open the ODIN landing and navigation hub.', href: '/odin' }, { title: 'ODIN-PR Planetary Registry', description: 'Browse PR-001 through PR-025 worlds.', href: '/odin/planetary-registry' }, { title: 'PaaP™ Platforms', description: 'Review the 3-layer Canon / Platform / Store model.', href: '/odin/platforms' }]} />;
}
