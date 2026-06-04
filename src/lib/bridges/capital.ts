import { getWordpressBridgeConfig, wordpressRequest } from './platform';

export type CapitalBridgeRecord = {
  id: string;
  title: string;
  status: 'draft' | 'review' | 'active' | 'archived';
  instrumentType?: string;
  updatedAt?: string;
};

export async function getCapitalRecordsFromWordpress() {
  return wordpressRequest<{ capital: CapitalBridgeRecord[] }>({ path: '/wp-json/omos/v1/capital', revalidate: 60 });
}

export function getCapitalBridgeStatus() {
  const config = getWordpressBridgeConfig();

  return {
    id: 'capital',
    status: config.status,
    source: 'wordpress',
    route: '/capital',
    endpoint: '/wp-json/omos/v1/capital',
    authentication: 'X-OMOS-App-Key'
  };
}
