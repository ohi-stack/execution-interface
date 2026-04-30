const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.onegodian.org";

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getOfferings() {
  return fetchJson("/api/capital/offerings");
}

export async function getOfferingBySlug(slug: string) {
  return fetchJson(`/api/capital/offerings/${encodeURIComponent(slug)}`);
}

export async function getCertificateById(id: string) {
  return fetchJson(`/api/capital/certificates/${encodeURIComponent(id)}`);
}

export async function getInvestorDashboard() {
  return fetchJson("/api/capital/investors/me");
}

export async function getLedgerRecords() {
  return fetchJson("/api/capital/ledger");
}

export { API_BASE_URL };
