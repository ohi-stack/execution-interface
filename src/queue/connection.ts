import IORedis from "ioredis";
import { env } from "../config/env";

export const redis = new IORedis({
  host: env.redisHost,
  port: env.redisPort,
  password: env.redisPassword || undefined,
  maxRetriesPerRequest: null
});
