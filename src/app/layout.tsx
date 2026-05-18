import './globals.css';
import type { Metadata } from 'next';
import { CapitalNavigation } from './components/CapitalNavigation';
import { CapitalFooter } from './components/CapitalFooter';

export const metadata: Metadata = { title: 'OneGodian Domain Surfaces', description: 'Separated app.onegodian.com member app and console.onegodian.com operator console.' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><CapitalNavigation />{children}<CapitalFooter /></body></html>;
}
