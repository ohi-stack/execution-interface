export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? '1.1.0';
export const PLATFORM_NAME = 'INO Platform Sync Node';
export const PRODUCTION_DOMAIN = 'app.indigenousnations.org';

export const requiredRoutes = [
  '/', '/dashboard', '/members', '/programs', '/housing', '/grants', '/volunteers',
  '/documents', '/certificates', '/media', '/notifications', '/settings', '/admin',
  '/admin/sync', '/admin/jobs', '/admin/audit', '/admin/system', '/docs',
];

export const syncResources = [
  'users', 'memberships', 'identities', 'programs', 'volunteers', 'housing',
  'grants', 'certificates', 'documents', 'forms', 'notifications',
] as const;

export type SyncStatus = 'pending' | 'synced' | 'conflict' | 'failed' | 'deleted';
export type SyncObject = {
  local_id: string;
  wordpress_id: string | null;
  resource_type: (typeof syncResources)[number] | string;
  source_system: 'wordpress' | 'ino-platform-app' | 'plugin';
  version: string;
  checksum: string;
  updated_at: string;
  last_synced: string | null;
  status: SyncStatus;
};

export function publicManifest() {
  return {
    name: PLATFORM_NAME,
    domain: PRODUCTION_DOMAIN,
    version: APP_VERSION,
    node: '22 LTS',
    framework: 'Next.js App Router',
    modules: syncResources,
    endpoints: {
      health: '/api/health',
      ready: '/api/ready',
      manifest: '/api/manifest',
      syncStatus: '/api/sync/status',
      wordpressWebhook: '/api/webhooks/wordpress',
      pluginWebhook: '/api/webhooks/plugin',
    },
  };
}
