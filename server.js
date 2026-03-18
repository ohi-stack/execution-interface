const http = require('http');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const DATABASE_URL = process.env.DATABASE_URL || '';
const FORCE_REDEPLOY = process.env.FORCE_REDEPLOY || '1';

let db = null;

process.on('uncaughtException', (error) => {
  console.error('uncaughtException:', error);
});

process.on('unhandledRejection', (reason) => {
  console.error('unhandledRejection:', reason);
});

const initializeDatabase = async () => {
  try {
    if (!DATABASE_URL) {
      console.warn('DATABASE_URL is not set; starting without a database connection.');
      return null;
    }

    let Pool;

    try {
      ({ Pool } = require('pg'));
    } catch (error) {
      console.error('Postgres driver (pg) is not installed; starting without database support.', error);
      return null;
    }

    const pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: process.env.PGSSLMODE === 'disable' ? false : { rejectUnauthorized: false },
    });

    try {
      await pool.query('SELECT 1');
      console.log('Database connection ready.');
      db = pool;
      return pool;
    } catch (error) {
      console.error('Database connection failed; continuing without database.', error);
      return null;
    }
  } catch (error) {
    console.error('Unexpected database initialization error; continuing startup.', error);
    return null;
  }
};

const send = (res, statusCode, body, contentType = 'text/plain; charset=utf-8') => {
  res.writeHead(statusCode, {
    'Content-Type': contentType,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(body);
};

const sendJson = (res, statusCode, payload) => {
  send(res, statusCode, JSON.stringify(payload), 'application/json; charset=utf-8');
};

const requestHandler = (req, res) => {
  try {
    if (req.method === 'OPTIONS') {
      send(res, 204, '');
      return;
    }

    if (req.method === 'GET' && req.url === '/health') {
      sendJson(res, 200, {
        status: 'ok',
        database: db ? 'connected' : 'offline',
        forceRedeploy: FORCE_REDEPLOY,
      });
      return;
    }

    if (req.method === 'GET' && req.url === '/') {
      send(res, 200, 'ONLINE');
      return;
    }

    sendJson(res, 404, { error: 'Not found.' });
  } catch (error) {
    console.error('Request handling error:', error);
    sendJson(res, 500, { error: 'Internal server error.' });
  }
};

const app = http.createServer(requestHandler);

initializeDatabase().catch((error) => {
  console.error('Database startup promise rejected; server will continue running.', error);
});

app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
  console.log(`FORCE_REDEPLOY=${FORCE_REDEPLOY}`);
});
