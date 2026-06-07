import { jsonResponse } from '@/lib/api-json';
import { registryContent, learningContent, omosContent, capitalContent } from '@/data/onegodianContent';

export async function GET(request: Request) {
  const tools = [registryContent, learningContent, omosContent, capitalContent].flatMap((route) =>
    route.cards.map((card) => ({ name: card.title, description: card.description, status: card.status, href: card.href }))
  );

  return jsonResponse(
    {
      status: 'ok',
      app: 'OneGodian App',
      toolCount: tools.length,
      tools
    },
    request
  );
}
