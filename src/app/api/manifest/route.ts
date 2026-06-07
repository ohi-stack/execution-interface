import { jsonResponse } from '@/lib/api-json';
import { manifest } from '@/data/manifest';

export async function GET(request: Request) {
  return jsonResponse(manifest, request);
}
