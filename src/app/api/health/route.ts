import { jsonResponse } from '@/lib/api-json';

export async function GET(request: Request) {
  return jsonResponse(
    {
      status: 'ok',
      service: 'omos-site',
      domain: 'OMOS.OneGodian.com',
      version: '1.0.0'
    },
    request
  );
}
