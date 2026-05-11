export const metadata = { title: 'OneGodian App | Certificates', description: 'The official OneGodian App dashboard for identity, membership, certificates, systems, tools, campaigns, products, and ecosystem access.' };

import { AppShell } from '@/components/app-shell';

export default function CertificatesPage() {
  return <AppShell title="Certificates" modules={[{ title: 'Credential Registry', description: 'Track issued certificates and verification states across the ecosystem.' }, { title: 'Verification API', description: 'Integrate certificate checks through secure bridge endpoints.', href: '/app-bridge' }]} />;
}
