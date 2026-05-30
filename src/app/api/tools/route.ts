import { jsonResponse } from '@/lib/api-json';

const labels = ['Coming Soon', 'Planned Module', 'Operational Layer', 'Requires Admin Integration'];

export async function GET(request: Request) {
  return jsonResponse(
    {
      app: 'OneGodian App Control Plane',
      route: '/api/tools',
      status: 'placeholder',
      labels,
      modules: [
        { name: 'Command utilities', status: 'planned' },
        { name: 'Diagnostics', status: 'planned' },
        { name: 'Workflow launchers', status: 'planned' },
        { name: 'Ecosystem tool access', status: 'planned' }
      ],
      operationalNote: 'This endpoint reserves the tools API surface. It does not expose executable backend tools until admin integration is present.'
    },
    request
  );
}
