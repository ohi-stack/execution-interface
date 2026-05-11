export const metadata = { title: 'OneGodian App | Admin', description: 'The official OneGodian App dashboard for identity, membership, certificates, systems, tools, campaigns, products, and ecosystem access.' };

import { AppShell } from '@/components/app-shell';

export default function AdminPage() {
  return <AppShell title="Admin" modules={[{ title: 'Admin Controls', description: 'Placeholder for governance and operations tooling.' }]} />;
}
