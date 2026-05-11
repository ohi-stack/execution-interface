export const metadata = { title: 'OneGodian App | Media', description: 'The official OneGodian App dashboard for identity, membership, certificates, systems, tools, campaigns, products, and ecosystem access.' };

import { AppShell } from '@/components/app-shell';

export default function MediaPage() {
  return <AppShell title="Media" modules={[{ title: 'Media Library', description: 'Store and manage campaign media, launch assets, and ecosystem visuals.' }, { title: 'Standards', description: 'Keep media aligned with OneGodian visual and documentation standards.', href: '/standards/visual-covers' }]} />;
}
