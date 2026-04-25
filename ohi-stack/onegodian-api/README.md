# onegodian-api

Production-ready Node 20 + TypeScript API for backend integration, identity, entitlement checks, verification, and future Onegodian platform services.

> Scope note: this service intentionally does **not** duplicate LMS plugin logic.

## Features

- Express API with TypeScript
- Security headers via Helmet
- CORS allowlist for:
  - `https://onegodian.org`
  - `https://u.onegodian.org`
  - `https://api.onegodian.org`
- Rate limiting (`100` requests / `15 min` per IP)
- Request logging via Morgan
- Centralized JSON error handling
- Health and status endpoints
- Placeholder integration endpoints:
  - `POST /v1/identity/verify`
  - `POST /v1/entitlements/check`

## Endpoints

- `GET /health`
- `GET /v1/status`
- `POST /v1/identity/verify` (placeholder, returns `501`)
- `POST /v1/entitlements/check` (placeholder, returns `501`)

## Local Development

```bash
npm install
cp .env.example .env
npm run dev
```

## Scripts

- `npm run dev` - run with hot reload
- `npm run build` - compile TypeScript to `dist/`
- `npm run start` - run built server
- `npm run lint` - run ESLint
- `npm run test` - run Vitest tests

## Hostinger Deployment (https://api.onegodian.org)

### 1) Provision application on Hostinger VPS

- Use a VPS plan with Node.js 20 support.
- Point DNS A/AAAA for `api.onegodian.org` to the VPS IP.
- SSH into server and install Node 20 LTS + npm.

### 2) Clone and build

```bash
git clone <your-repo-url> /var/www/onegodian-api
cd /var/www/onegodian-api/ohi-stack/onegodian-api
npm ci
cp .env.example .env
npm run build
```

Edit `.env` as needed (`PORT`, environment settings, service integrations).

### 3) Run with PM2

```bash
npm install -g pm2
pm2 start dist/server.js --name onegodian-api
pm2 save
pm2 startup
```

### 4) Reverse proxy with Nginx

Example `/etc/nginx/sites-available/api.onegodian.org`:

```nginx
server {
  listen 80;
  server_name api.onegodian.org;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Enable and reload:

```bash
sudo ln -s /etc/nginx/sites-available/api.onegodian.org /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5) Enable SSL

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.onegodian.org
```

### 6) CI/CD suggestion

- Configure GitHub Actions (included) to run lint/test/build on push and PR.
- For auto-deploy, add a separate workflow with SSH deploy keys and Hostinger secrets in GitHub Actions secrets.

## Security Notes

- Never commit `.env` or production credentials.
- Keep secrets in Hostinger environment variables or securely provisioned files.
- Rotate keys regularly.
