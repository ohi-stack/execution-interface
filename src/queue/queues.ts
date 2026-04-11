import { Queue } from "bullmq";
import { redis } from "./connection";

export const verifyQueue = new Queue("verify", {
  connection: redis
});
