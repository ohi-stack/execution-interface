import './globals.css';
import type { Metadata } from 'next';
import { AppShell } from '@/components/AppShell';
import { productionRelease } from '@/lib/production-docs';

export const metadata: Metadata = {
  metadataBase: new URL(productionRelease.canonicalHost),
  title: {
    default: 'The OneGodian App',
    template: '%s | The OneGodian App'
  },
  description: 'Unified access for identity, systems, records, education, commerce, media, verification, and OMOS Production Documentation Release 1.0.',
  applicationName: 'The OneGodian App',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'The OneGodian App',
    description: 'Public/member-facing access for OneGodian systems and OMOS Production Documentation Release 1.0.',
    url: '/',
    siteName: 'The OneGodian App',
    type: 'website'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <AppShell>{children}</AppShell>
    </html>
  );
}
