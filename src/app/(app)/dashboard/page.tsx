import { AppShell } from '@/components/app-shell';

export default function DashboardPage() {
  return (
    <AppShell
      title="Dashboard"
      modules={[
        {
          title: 'Planetary Registry',
          description: 'Sovereign record index for worlds, civilizations, and governance mappings.',
          href: '/planetary-registry',
          accent: 'gold',
          glyph: 'planet',
          featured: true,
          stats: ['25 Worlds Indexed', '94 Civilizations', 'ODIN Synced']
        },
        {
          title: 'Moons & Systems',
          description: 'Orbital catalog for moons, routes, and system-level observatory records.',
          href: '/moons-systems',
          accent: 'violet',
          glyph: 'moons',
          stats: ['73 Registered Moons', '12 Orbital Networks']
        },
        {
          title: 'Ecosystem',
          description: 'Connected infrastructure graph for gateways, services, and live interlinks.',
          href: '/ecosystem',
          accent: 'emerald',
          glyph: 'ecosystem',
          featured: true,
          stats: ['18 Connected Systems', '4 Active Gateways', 'Realtime Sync']
        }
      ]}
    />
  );
}
