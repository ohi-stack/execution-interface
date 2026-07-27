import type { PlatformStatus } from '@/config/platform-status';

export function PlatformStatusBadge({ status }: { status: PlatformStatus }) {
  return <span className={`platform-badge platform-badge--${status.toLowerCase().replaceAll(' ', '-')}`}>{status}</span>;
}
