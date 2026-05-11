import { AppShell } from '@/components/app-shell';

export default function ToolsPage() {
  return <AppShell title="Tools" modules={[{ title: 'Command Utilities', description: 'Operational tools for app diagnostics, sync workflows, and execution support.' }, { title: 'Data Connectors', description: 'Bridge ecosystem registries, member records, and product/media data.' }, { title: 'Automation', description: 'Run repeatable build and deployment workflows across modules.', href: '/production-checklist' }]} />;
}
