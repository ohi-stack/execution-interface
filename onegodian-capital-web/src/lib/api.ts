const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.onegodian.org';

async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function getOfferings() {
  return apiGet('/api/capital/offerings');
}

export async function getOfferingBySlug(slug: string) {
  return apiGet(`/api/capital/offerings/${slug}`);
}

export async function getCertificateById(id: string) {
  return apiGet(`/api/capital/certificates/${id}`);
}

export async function getInvestorDashboard() {
  return apiGet('/api/capital/investors/me');
}

export async function getLedgerRecords() {
  return apiGet('/api/capital/ledger');
}
