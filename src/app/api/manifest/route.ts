import manifest from '@/data/manifest.json';

export async function GET() {
  return Response.json({ ...manifest, generated_at: new Date().toISOString() });
}
