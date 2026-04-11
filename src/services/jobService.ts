import { JobRecord } from "../types/jobs";

const jobs = new Map<string, JobRecord>();

export function saveJob(job: JobRecord): JobRecord {
  jobs.set(job.id, job);
  return job;
}

export function getJob(id: string): JobRecord | undefined {
  return jobs.get(id);
}

export function updateJob(id: string, patch: Partial<JobRecord>): JobRecord | undefined {
  const existing = jobs.get(id);
  if (!existing) return undefined;

  const updated: JobRecord = {
    ...existing,
    ...patch,
    updatedAt: new Date().toISOString()
  };

  jobs.set(id, updated);
  return updated;
}
