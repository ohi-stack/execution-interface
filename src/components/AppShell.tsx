import { GlobalNavigation } from '@/components/GlobalNavigation';
import { Footer } from '@/components/Footer';
export function AppShell({ children }: { children: React.ReactNode }) { return <body><GlobalNavigation /><main id="main-content" className="shell">{children}</main><Footer /></body>; }
