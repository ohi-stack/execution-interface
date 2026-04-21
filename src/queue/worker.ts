import { Worker } from "bullmq";
import { redis } from "./connection";
import { updateJob } from "../services/jobService";
import { logger } from "../utils/logger";

const worker = new Worker(
  "verify",
  async (job: any) => {
    const { jobId, payload } = job.data as {
      jobId: string;
      payload: { subject: string; type: string; metadata?: Record<string, unknown> };
    };

    updateJob(jobId, { status: "active" });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const result = {
      verified: true,
      subject: payload.subject,
      type: payload.type,
      processedAt: new Date().toISOString()
    };

    updateJob(jobId, {
      status: "completed",
      result
    });

    return result;
  },
  { connection: redis }
);

worker.on("completed", (job: any) => {
  logger.info(`Worker completed job ${job.id}`);
});

worker.on("failed", (job: any, err: any) => {
  if (job?.data?.jobId) {
    updateJob(job.data.jobId, {
      status: "failed",
      error: err.message
    });
  }
  logger.error(`Worker failed job ${job?.id}`, err.message);
});
