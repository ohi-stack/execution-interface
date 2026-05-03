import { AppShell } from '@/components/app-shell';

const DASHBOARD_MODULES = [
  { title: 'Ecosystem Directory', description: 'Central listing of OneGodian systems, sync states, and actions.', href: '/ecosystem' },
  { title: 'ODIN Registry', description: 'Browse protocol records and indexed entities.', href: '/registry' },
  { title: 'Galaxy', description: 'Explore moon systems and planetary network modules.', href: '/moons-systems' },
  { title: 'Products', description: 'Review digital product modules and commerce surfaces.', href: '/products' },
  { title: 'Certificates', description: 'Access OBP-1 certificate and verification modules.', href: '/certificates' },
  { title: 'Learning', description: 'Open education and knowledge modules.', href: '/learning' },
  { title: 'Media', description: 'Launch media hubs and publishing modules.', href: '/media' },
  { title: 'Tools', description: 'Open operational tools and utilities.', href: '/tools' }
];

export default function DashboardPage() {
  return <AppShell title="Dashboard" modules={DASHBOARD_MODULES} />;
}
