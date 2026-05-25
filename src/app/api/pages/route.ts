import pages from '@/data/pages.json';

export async function GET() {
  return Response.json({ pages });
}
