import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/AppShell';
import { accPositioning, accRepository } from '@/lib/acc-content';

export const metadata: Metadata = {
  metadataBase: new URL(accRepository.deployTarget),
  title: {
    default: accPositioning.name,
    template: `%s | ${accPositioning.shortName}`
  },
  description: accPositioning.summary,
  applicationName: accPositioning.name,
  alternates: { canonical: '/' },
  robots: {
    index: false,
    follow: false,
    nocache: true
  },
  openGraph: {
    title: accPositioning.name,
    description: accPositioning.summary,
    url: accRepository.deployTarget,
    siteName: accPositioning.name,
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
