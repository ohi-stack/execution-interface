import './globals.css';
import type { Metadata } from 'next';
import { CapitalNavigation } from './components/CapitalNavigation';
import { CapitalFooter } from './components/CapitalFooter';

export const metadata: Metadata = { title: 'ONEGODIAN CAPITAL PORTAL™', description: 'Private capital infrastructure for records, disclosures, certificates, contributor intake, and verification.' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><CapitalNavigation />{children}<CapitalFooter /></body></html>;
}
