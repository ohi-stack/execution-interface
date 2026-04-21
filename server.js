import dotenv from 'dotenv';
import app from './src/app.js';

dotenv.config();

const port = Number(process.env.PORT) || 3000;
const host = '0.0.0.0';

const server = app.listen(port, host, () => {
  console.log(`Onegodian Public Site listening on http://${host}:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Onegodian API base URL: ${process.env.ONEGODIAN_API_BASE_URL || 'https://onegodian-api.onrender.com'}`);
});

const shutdown = (signal) => {
  console.log(`Received ${signal}. Shutting down Onegodian Public Site.`);
  server.close(() => process.exit(0));
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
