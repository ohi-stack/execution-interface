import type { Metadata } from 'next';
import { OmosPageTemplate } from '@/components/omos/OmosPageTemplate';
import { getOmosPage } from '@/data/omos-pages';

export const metadata: Metadata = {
  title: 'OMOS Implementation Architecture',
  description: 'Platform map for OMOS.OneGodian.com, app.OneGodian.com, OneGodian.org, OneGodian.com, QuantumOHI.com, and QRV.Network.',
  alternates: { canonical: '/implementation' }
};

export default function ImplementationPage() {
  return <OmosPageTemplate page={getOmosPage('implementation')!} />;
}
