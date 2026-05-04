import { AppShell } from '@/components/app-shell';

export default function GalaxyPage() {
  return (
    <AppShell
      title="OneGodian Galaxy"
      modules={[
        { title: 'Galactic Canon', description: 'Open the full canon hub and planetary atlas experience.', href: '/galactic-canon', accent: 'cyan', glyph: 'registry' },
        { title: 'Planets', description: 'Browse the planetary registry and ODIN-PR world index.', href: '/galaxy/planets', accent: 'violet', glyph: 'planet' },
        { title: 'Moons & Systems', description: 'Review moon systems, orbital groups, and classification details.', href: '/galaxy/moons-systems', accent: 'emerald', glyph: 'moons' },
        { title: 'Realms', description: 'Read ecosystem and realm-layer modules tied to the galaxy map.', href: '/ecosystem', accent: 'gold', glyph: 'ecosystem' }
      ]}
    />
  );
}
