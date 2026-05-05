import { NextResponse } from 'next/server';
import { memberEndpoints, membersProductionChecklist, memberTools, MEMBERS_WORDPRESS_BASE_URL } from '@/lib/members';

export async function GET() {
  return NextResponse.json({
    module: 'OneGodian Members',
    slug: 'members',
    status: 'bridge-ready',
    wordpressBaseUrl: MEMBERS_WORDPRESS_BASE_URL,
    pluginVersionTarget: '1.1.0',
    routes: {
      app: '/members',
      healthProxy: '/api/members/health',
      manifest: '/api/members/manifest'
    },
    tools: memberTools,
    endpoints: memberEndpoints,
    productionChecklist: membersProductionChecklist
  });
}
