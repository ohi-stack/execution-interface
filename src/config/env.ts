export type AppEnv = {
  NODE_ENV: string;
  PORT: number;
  LOG_LEVEL: "debug" | "info" | "warn" | "error";
};

const parsePort = (value: string | undefined): number => {
  const parsed = Number.parseInt(value ?? "3000", 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    throw new Error(`Invalid PORT value: ${value ?? "undefined"}`);
  }
  return parsed;
};

const parseLogLevel = (value: string | undefined): AppEnv["LOG_LEVEL"] => {
  const normalized = (value ?? "info").toLowerCase();
  if (["debug", "info", "warn", "error"].includes(normalized)) {
    return normalized as AppEnv["LOG_LEVEL"];
  }

  throw new Error(`Invalid LOG_LEVEL value: ${value ?? "undefined"}`);
};

export const env: AppEnv = {
  NODE_ENV: process.env.NODE_ENV ?? "production",
  PORT: parsePort(process.env.PORT),
  LOG_LEVEL: parseLogLevel(process.env.LOG_LEVEL)
};
