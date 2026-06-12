import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/AppShell';
import { appPositioning, appRepository } from '@/lib/acc-content';

export const metadata: Metadata = {
  metadataBase: new URL(appRepository.deployTarget),
  title: {
    default: appPositioning.name,
    template: `%s | ${appPositioning.shortName}`
  },
  description: appPositioning.summary,
  applicationName: appPositioning.name,
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    title: appPositioning.name,
    description: appPositioning.summary,
    url: appRepository.deployTarget,
    siteName: appPositioning.name,
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
