import data from '@/data/plugin-consumers.json';
import { jsonResponse } from '@/lib/api-json';

export async function GET(request: Request) {
  return jsonResponse({ status: 'ok', ...data }, request);
}
