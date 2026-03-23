import './globals.css';

export const metadata = {
  title: 'Issuer Portal | qrv.network',
  description: 'Issuer portal MVP for record issuance, verification, and revocation.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
