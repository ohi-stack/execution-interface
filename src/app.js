import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import portalRoutes from './routes/index.js';
import { renderLayout } from './views/layout.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.disable('x-powered-by');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/css', express.static(path.join(__dirname, '../public/css')));
app.use('/js', express.static(path.join(__dirname, '../public/js')));
app.use('/assets', express.static(path.join(__dirname, '../public/assets')));

app.use((req, _res, next) => {
  console.log(`[portal] ${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/', portalRoutes);

app.use((req, res) => {
  res.status(404).send(renderLayout({
    pageTitle: 'Onegodian Time',
    body: `<main class="content-wrap"><section class="card"><h2>Page not found</h2><p class="supporting-copy">The requested page does not exist.</p></section></main>`,
  }));
});

app.use((error, _req, res, _next) => {
  console.error('Unhandled portal error:', error);

  res.status(500).send(renderLayout({
    pageTitle: 'Onegodian Time',
    body: `<main class="content-wrap"><section class="card"><h2>Service unavailable</h2><p class="supporting-copy">An unexpected error occurred while rendering the public site.</p></section></main>`,
  }));
});

export default app;
