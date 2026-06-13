import { GlobalNavigation } from '@/components/GlobalNavigation';
import { Footer } from '@/components/Footer';
export function AppShell({ children }: { children: React.ReactNode }) { return <body><GlobalNavigation /><div className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div><Footer /></body>; }
