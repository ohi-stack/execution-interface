# Deploying `app.onegodian.com` on Hostinger VPS

1. Install Node.js LTS and PM2.
2. Clone repository and install dependencies in `apps/web`:
   - `npm install`
3. Build the app:
   - `npm run build`
4. Start with PM2:
   - `pm2 start npm --name onegodian-app -- start`
5. Put Nginx in front of the Node process as reverse proxy.
6. Configure SSL and force HTTPS.

## Nginx reverse proxy (example)

```nginx
server {
  listen 80;
  server_name app.onegodian.com;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```
