import data from '@/data/tools.json';
import { jsonResponse } from '@/lib/api-json';
import { controlPlanePlaceholderLabels } from '@/lib/control-plane';

export async function GET(request: Request) {
  return jsonResponse(
    {
      app: 'OneGodian App Control Plane',
      route: '/api/tools',
      status: 'placeholder',
      labels: controlPlanePlaceholderLabels,
      existingRegistry: data.tools,
      modules: [
        { name: 'Command utilities', status: 'planned' },
        { name: 'Diagnostics', status: 'planned' },
        { name: 'Workflow launchers', status: 'planned' },
        { name: 'Ecosystem tool access', status: 'planned' }
      ],
      operationalNote: 'This endpoint reserves the tools API surface and preserves the existing static tool registry. It does not expose executable backend tools until admin integration is present.'
    },
    request
  );
}
