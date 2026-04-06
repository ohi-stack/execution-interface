import dotenv from 'dotenv';
import app from './src/app.js';
import { closePool, isDatabaseConfigured } from './src/services/databaseService.js';
import { initializeRegistrySchema } from './src/services/registryService.js';

dotenv.config();

const port = Number(process.env.PORT) || 3000;
const host = '0.0.0.0';

const startServer = async () => {
  try {
    if (isDatabaseConfigured()) {
      await initializeRegistrySchema();
    } else {
      console.warn('DATABASE_URL is not configured. Registry endpoints will return a 503 until it is set.');
    }

    const server = app.listen(port, host, () => {
      console.log(`QR-V Execution Interface listening on http://${host}:${port}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Portal API base URL: ${process.env.API_BASE_URL || 'https://api.qrv.network'}`);
      console.log(`Verification base URL: ${process.env.VERIFY_BASE_URL || 'https://verify.qrv.network'}`);
    });

    const shutdown = async (signal) => {
      console.log(`Received ${signal}. Shutting down QR-V Execution Interface.`);
      server.close(async () => {
        await closePool();
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('Failed to start application:', error);
    await closePool();
    process.exit(1);
  }
};

await startServer();
