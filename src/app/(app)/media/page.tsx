import { ModuleShellPage } from '@/components/module-shell-page';

export const metadata = {
  title: 'OneGodian App | Media',
  description: 'The official OneGodian App dashboard for identity, membership, certificates, systems, tools, campaigns, products, and ecosystem access.'
};

export default function MediaPage() {
  return <ModuleShellPage slug="media" />;
}
