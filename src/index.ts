import { createServer } from "node:http";
import { app } from "./app.js";
import { env } from "./config/env.js";

const server = createServer(app);

server.listen(env.port, () => {
  console.log(`${env.appName} v${env.appVersion} listening on port ${env.port}`);
});

const shutdown = (signal: NodeJS.Signals): void => {
  console.log(`Received ${signal}. Starting graceful shutdown...`);

  server.close((error?: Error) => {
    if (error) {
      console.error("Error during shutdown:", error);
      process.exit(1);
    }

    console.log("HTTP server closed. Goodbye.");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
