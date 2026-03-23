import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'QR-V Issuer Workspace',
  description: 'Next.js issuer UI for creating records and shipping QR-ready verification links.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
