const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`API error ${response.status}`);
  return response.json() as Promise<T>;
}

export const getCapitalOfferings = () => apiGet('/api/capital/offerings');
export const getCapitalOfferingById = (id: string) => apiGet(`/api/capital/offerings/${id}`);
export const getCurrentInvestor = () => apiGet('/api/capital/investors/me');
export const getCertificateById = (id: string) => apiGet(`/api/capital/certificates/${id}`);
export const getDisclosureById = (id: string) => apiGet(`/api/capital/disclosures/${id}`);
export const getCapitalLedger = () => apiGet('/api/capital/ledger');
