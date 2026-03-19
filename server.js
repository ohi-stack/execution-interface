import dotenv from 'dotenv';
import express from 'express';
import recordsRouter from './routes/records.js';
import verifyRouter from './routes/verify.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;
const host = '0.0.0.0';

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use('/records', recordsRouter);
app.use('/verify', verifyRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use((err, _req, res, _next) => {
  console.error('Unhandled application error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error.',
  });
});

app.listen(port, host, () => {
  console.log(`QR-V Verification API listening on http://${host}:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Verify base URL: ${process.env.VERIFY_BASE_URL || 'https://verify.qrv.network'}`);
});
