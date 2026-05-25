import pages from '@/data/pages.json';

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const page = pages.find((p) => p.slug === params.slug);
  if (!page) return Response.json({ error: 'not_found' }, { status: 404 });
  return Response.json(page);
}
