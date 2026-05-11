export const metadata = { title: 'OneGodian App | Products', description: 'The official OneGodian App dashboard for identity, membership, certificates, systems, tools, campaigns, products, and ecosystem access.' };

import { AppShell } from '@/components/app-shell';

export default function ProductsPage() {
  return <AppShell title="Products" modules={[{ title: 'Product Catalog', description: 'Central listing of OneGodian products, bundles, and active offerings.' }, { title: 'Release Controls', description: 'Coordinate release readiness with production checklist standards.', href: '/production-checklist' }]} />;
}
