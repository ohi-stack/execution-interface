export type JobStatus = "queued" | "active" | "completed" | "failed";

export interface VerifyPayload {
  subject: string;
  type: string;
  metadata?: Record<string, unknown>;
}

export interface JobRecord {
  id: string;
  name: string;
  status: JobStatus;
  payload: unknown;
  createdAt: string;
  updatedAt: string;
  result?: unknown;
  error?: string;
}
