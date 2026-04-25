import { app } from "./app.js";

const HOST = "0.0.0.0";
const PORT = Number(process.env.PORT ?? 3000);
const requiresDatabase = process.env.DATABASE_REQUIRED === "true";

if (requiresDatabase && !process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required when DATABASE_REQUIRED=true.");
  process.exit(1);
}

const server = app.listen(PORT, HOST, () => {
  console.log(`Server listening on ${HOST}:${PORT}`);
});

const shutdown = (signal: string) => {
  console.log(`Received ${signal}, shutting down gracefully...`);
  server.close(() => {
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
