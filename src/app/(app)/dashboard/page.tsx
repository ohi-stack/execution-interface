import { AppShell } from '@/components/app-shell';

export default function DashboardPage() {
  return (
    <AppShell title="Dashboard" description="Access OneGodian platform modules, registry tools, and governance data.">
      <p className="text-sm text-slate-300">Canonical deployable dashboard now lives in <code>apps/web</code>.</p>
    </AppShell>
  );
}
