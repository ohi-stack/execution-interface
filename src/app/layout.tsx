import './globals.css';
import type { Metadata } from 'next';
import { CapitalNavigation } from './components/CapitalNavigation';
import { CapitalFooter } from './components/CapitalFooter';

export const metadata: Metadata = { title: 'OneGodian Control Plane', description: 'OneGodian App Command Dashboard for app.onegodian.com' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><CapitalNavigation />{children}<CapitalFooter /></body></html>;
}
