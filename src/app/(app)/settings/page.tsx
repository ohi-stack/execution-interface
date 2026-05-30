import { ControlPlanePlaceholder } from '@/components/control-plane-placeholder';

export const metadata = {
  title: 'OneGodian App | Settings',
  description: 'Production-safe control plane placeholder for OneGodian settings.'
};

export default function SettingsPage() {
  return (
    <ControlPlanePlaceholder
      title="Settings"
      layer="settings"
      description="Reserved operational layer for future tenant configuration, user preferences, security controls, and admin-managed defaults."
      modules={['Tenant configuration', 'User preferences', 'Security controls', 'Admin-managed defaults']}
    />
  );
}
