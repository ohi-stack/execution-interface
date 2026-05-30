import { ControlPlanePlaceholder } from '@/components/control-plane-placeholder';

export const metadata = {
  title: 'OneGodian App | Admin',
  description: 'Production-safe control plane placeholder for OneGodian administration.'
};

export default function AdminPage() {
  return (
    <ControlPlanePlaceholder
      title="Admin"
      layer="admin"
      description="Reserved operator surface for future authenticated administration, policy controls, approvals, audit review, and system operations."
      modules={['Authenticated administration', 'Policy controls', 'Approvals', 'Audit review']}
    />
  );
}
