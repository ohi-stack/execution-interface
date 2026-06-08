import { getWordpressBridgeConfig, wordpressRequest } from './platform';

export type MemberBridgeRecord = {
  id: string;
  displayName: string;
  status: 'active' | 'pending' | 'inactive';
  membershipTier?: string;
  updatedAt?: string;
};

export async function getMembersFromWordpress() {
  return wordpressRequest<{ members: MemberBridgeRecord[] }>({ path: '/wp-json/omos/v1/members', revalidate: 60 });
}

export function getMembersBridgeStatus() {
  const config = getWordpressBridgeConfig();

  return {
    id: 'members',
    status: config.status,
    source: 'wordpress',
    route: '/members',
    endpoint: '/wp-json/omos/v1/members',
    authentication: 'X-OMOS-App-Key'
  };
}
