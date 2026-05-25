import manifest from '@/data/manifest.json';
import OmosPageShell from '@/app/components/omos/OmosPageShell';

export default function ManifestPage() {
  return (
    <div>
      <OmosPageShell title="Manifest" summary="Canonical OMOS runtime manifest." />
      <pre style={{ maxWidth: 900, margin: '0 auto 2rem', padding: '1rem', background: '#020617', color: '#bfdbfe', borderRadius: 12, overflowX: 'auto' }}>
        {JSON.stringify({ ...manifest, generated_at: new Date().toISOString() }, null, 2)}
      </pre>
    </div>
  );
}
