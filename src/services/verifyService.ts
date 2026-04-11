import { v4 as uuid } from "uuid";
import { verifyQueue } from "../queue/queues";
import { saveJob } from "./jobService";
import { VerifyPayload } from "../types/jobs";

export async function enqueueVerify(payload: VerifyPayload) {
  const id = uuid();

  const record = saveJob({
    id,
    name: "verify",
    status: "queued",
    payload,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  await verifyQueue.add("verify", { jobId: id, payload });

  return record;
}
