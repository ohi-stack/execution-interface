import dotenv from "dotenv";

dotenv.config();

type NodeEnv = "development" | "test" | "production";

const allowedNodeEnvs: NodeEnv[] = ["development", "test", "production"];

const parsePort = (value: string | undefined): number => {
  if (!value) {
    return 3000;
  }

  const port = Number.parseInt(value, 10);

  if (Number.isNaN(port) || port < 1 || port > 65535) {
    throw new Error("Invalid PORT. Expected an integer between 1 and 65535.");
  }

  return port;
};

const parseNodeEnv = (value: string | undefined): NodeEnv => {
  const nodeEnv = value ?? "development";

  if (!allowedNodeEnvs.includes(nodeEnv as NodeEnv)) {
    throw new Error("Invalid NODE_ENV. Expected development, test, or production.");
  }

  return nodeEnv as NodeEnv;
};

const parseRequired = (name: string, value: string | undefined): string => {
  const trimmed = value?.trim();

  if (!trimmed) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return trimmed;
};

const parseCorsOrigins = (value: string | undefined): string[] => {
  if (!value?.trim()) {
    return [];
  }

  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const parseTrustProxy = (value: string | undefined): boolean => {
  if (!value?.trim()) {
    return false;
  }

  const normalized = value.trim().toLowerCase();

  if (!["true", "false"].includes(normalized)) {
    throw new Error("Invalid TRUST_PROXY. Expected true or false.");
  }

  return normalized === "true";
};

const nodeEnv = parseNodeEnv(process.env.NODE_ENV);

export const env = {
  port: parsePort(process.env.PORT),
  nodeEnv,
  isProduction: nodeEnv === "production",
  appName: parseRequired("APP_NAME", process.env.APP_NAME),
  appVersion: parseRequired("APP_VERSION", process.env.APP_VERSION),
  corsOrigins: parseCorsOrigins(process.env.CORS_ORIGINS),
  trustProxy: parseTrustProxy(process.env.TRUST_PROXY)
};
