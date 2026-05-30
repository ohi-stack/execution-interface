import { jsonResponse } from '@/lib/api-json';

const labels = ['Coming Soon', 'Planned Module', 'Operational Layer', 'Requires Admin Integration'];

export async function GET(request: Request) {
  return jsonResponse(
    {
      app: 'OneGodian App Control Plane',
      route: '/api/stats',
      status: 'placeholder',
      labels,
      statsAvailable: false,
      modules: [
        { name: 'Usage metrics', status: 'planned' },
        { name: 'Operational health', status: 'planned' },
        { name: 'Administrative reporting', status: 'planned' },
        { name: 'Audit metrics', status: 'planned' }
      ],
      operationalNote: 'This endpoint reserves the stats API surface. It does not return live metrics until verified production data sources are integrated.'
    },
    request
  );
}
