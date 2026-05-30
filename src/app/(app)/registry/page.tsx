import { ControlPlanePlaceholder } from '@/components/control-plane-placeholder';

export const metadata = {
  title: 'OneGodian App | Registry',
  description: 'Production-safe control plane placeholder for the OneGodian registry.'
};

export default function RegistryPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <ControlPlanePlaceholder
        title="Registry"
        layer="registry"
        description="Reserved operational layer for future entity, module, artifact, certificate, and ecosystem registry administration."
        modules={['Entity registry', 'Module registry', 'Artifact registry', 'Ecosystem registry']}
      />
    </main>
  );
}
