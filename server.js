import dotenv from 'dotenv';
import app from './src/app.js';

dotenv.config();

const port = Number(process.env.PORT) || 3000;
const host = '0.0.0.0';

const server = app.listen(port, host, () => {
  console.log(`QR-V Verification Portal listening on http://${host}:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API base URL: ${process.env.NEXT_PUBLIC_API_URL || process.env.API_BASE_URL || 'https://api.qrv.network'}`);
});

const shutdown = (signal) => {
  console.log(`Received ${signal}. Shutting down QR-V Verification Portal.`);
  server.close(() => process.exit(0));
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
