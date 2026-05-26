import consumers from '@/data/plugin-consumers.json';
import shortcodes from '@/data/plugin-shortcodes.json';
import { jsonResponse } from '@/lib/api-json';

export async function GET(request: Request) {
  return jsonResponse(
    {
      status: 'ok',
      sync: {
        consumers: consumers.consumers,
        shortcodes: shortcodes.shortcodes,
        endpoints: ['/api/plugin-consumers', '/api/plugin-shortcodes', '/api/plugin-sync']
      }
    },
    request
  );
}
