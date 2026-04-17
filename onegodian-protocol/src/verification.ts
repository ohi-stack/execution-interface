export interface VerificationSource {
  id: string;
  description: string;
}

export const DEFAULT_SOURCES: VerificationSource[] = [
  { id: 'public-spec', description: 'Published OneGodian protocol specification.' },
  { id: 'institutional-docs', description: 'Public institutional reference documents.' }
];
