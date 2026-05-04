import {
  mockOneGodianIdAdminRows,
  mockOneGodianIdRecord,
  mockOneGodianIdStats,
} from "./mock";
import type {
  OneGodianIdAdminRow,
  OneGodianIdCardRecord,
  OneGodianIdCardStats,
} from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_ONEGODIAN_API_URL?.replace(/\/$/, "") || "";

async function safeJsonFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) return fallback;

    const data = (await response.json()) as T;
    return data;
  } catch {
    return fallback;
  }
}

export async function getOneGodianIdCardStatus(): Promise<OneGodianIdCardRecord> {
  return safeJsonFetch<OneGodianIdCardRecord>(
    "/api/id-card/status",
    mockOneGodianIdRecord,
  );
}

export async function getOneGodianIdCardByMemberId(
  memberId: string,
): Promise<OneGodianIdCardRecord> {
  return safeJsonFetch<OneGodianIdCardRecord>(
    `/api/id-card/${encodeURIComponent(memberId)}`,
    mockOneGodianIdRecord,
  );
}

export async function getOneGodianIdAdminRows(): Promise<OneGodianIdAdminRow[]> {
  return safeJsonFetch<OneGodianIdAdminRow[]>(
    "/api/id-card/admin",
    mockOneGodianIdAdminRows,
  );
}

export async function getOneGodianIdStats(): Promise<OneGodianIdCardStats> {
  return safeJsonFetch<OneGodianIdCardStats>(
    "/api/id-card/admin/stats",
    mockOneGodianIdStats,
  );
}
