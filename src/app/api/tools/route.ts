import { jsonResponse } from '@/lib/api-json';
import { tools } from '@/data/tools';

export async function GET(request: Request) {
  return jsonResponse(
    {
      status: 'ok',
      service: 'omos-site',
      tools
    },
    request
  );
}
