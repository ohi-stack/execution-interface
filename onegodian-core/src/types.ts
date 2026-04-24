export interface AuditRecord {
  timestampUtc: string;
  event: string;
  actor: string;
}
