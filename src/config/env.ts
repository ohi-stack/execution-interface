import dotenv from "dotenv";

dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4010),
  redisHost: required("REDIS_HOST", "127.0.0.1"),
  redisPort: Number(process.env.REDIS_PORT ?? 6379),
  redisPassword: process.env.REDIS_PASSWORD ?? "",
  jwtSecret: required("JWT_SECRET"),
  identityIssuer: process.env.IDENTITY_ISSUER ?? "https://identity.quantumohi.com",
  serviceName: process.env.SERVICE_NAME ?? "instryx.qrv.network"
};
