import { ModuleShellPage } from '@/components/module-shell-page';

export const metadata = {
  title: 'OneGodian App | Profile',
  description: 'The official OneGodian App dashboard for identity, membership, certificates, systems, tools, campaigns, products, and ecosystem access.'
};

export default function ProfilePage() {
  return <ModuleShellPage slug="profile" />;
}
