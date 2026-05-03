import { AppShell } from '@/components/app-shell';

export default function DashboardPage() {
  return <AppShell title="Dashboard" modules={[{ title: 'Authenticated Area', description: 'Auth.js-ready shell for signed-in users.' }]} />;
}
