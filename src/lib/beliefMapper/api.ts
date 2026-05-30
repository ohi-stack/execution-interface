import type { BeliefMapperAnswer, BeliefMapperResult } from './scoring';
import { getBeliefMapperResult } from './scoring';

export type BeliefMapperProfilePayload = {
  email?: string;
  displayName?: string;
  answers: BeliefMapperAnswer[];
  consentToSave: boolean;
};

export type BeliefMapperProfileResponse = {
  result: BeliefMapperResult;
  saved: boolean;
  message: string;
};

const localStorageKey = 'onegodian:belief-mapper-profile';

export async function submitBeliefMapperProfile(payload: BeliefMapperProfilePayload): Promise<BeliefMapperProfileResponse> {
  const result = getBeliefMapperResult(payload.answers);

  if (payload.consentToSave && typeof window !== 'undefined') {
    window.localStorage.setItem(
      localStorageKey,
      JSON.stringify({ ...payload, resultId: result.id, savedAt: new Date().toISOString() })
    );
  }

  return {
    result,
    saved: payload.consentToSave,
    message: payload.consentToSave
      ? 'Belief Mapper™ profile saved locally for the app experience.'
      : 'Belief Mapper™ result calculated without storing belief data.'
  };
}

export function readBeliefMapperProfile(): BeliefMapperProfilePayload | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawProfile = window.localStorage.getItem(localStorageKey);
  return rawProfile ? (JSON.parse(rawProfile) as BeliefMapperProfilePayload) : null;
}

export function clearBeliefMapperProfile() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(localStorageKey);
  }
}
