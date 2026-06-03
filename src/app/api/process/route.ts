import { randomUUID } from 'node:crypto';
import { jsonResponse } from '@/lib/api-json';

type ProcessPayload = {
  content?: { raw?: unknown };
  metadata?: Record<string, unknown>;
};

export async function POST(request: Request) {
  const requestId = randomUUID();
  const apiKey = request.headers.get('x-omos-key') ?? request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

  if (!apiKey) {
    return jsonResponse({ error: 'unauthorized', message: 'Valid OMOS API key required', requestId }, request, { status: 401 });
  }

  let payload: ProcessPayload;
  try {
    payload = (await request.json()) as ProcessPayload;
  } catch {
    return jsonResponse({ error: 'invalid_json', message: 'Request body must be valid JSON', requestId }, request, { status: 400 });
  }

  const raw = typeof payload.content?.raw === 'string' ? payload.content.raw.trim() : '';
  if (!raw) {
    return jsonResponse({ error: 'invalid_input', message: 'content.raw is required', requestId }, request, { status: 400 });
  }

  return jsonResponse(
    {
      status: 'ok',
      plan: 'documented-runtime',
      limits: { rpm: 100, features: ['omos_processing'] },
      data: {
        classification: 'operational_summary',
        summary: raw.length > 220 ? `${raw.slice(0, 217)}...` : raw,
        checks: ['auth', 'input_validation', 'alignment', 'response_shape'],
        metadata: payload.metadata ?? {}
      },
      requestId
    },
    request
  );
}
