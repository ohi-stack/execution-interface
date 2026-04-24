# Hostinger Ubuntu VPS cutover commands (QR-V)

## 1) Install runtime dependencies
```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
sudo npm i -g pm2
```

## 2) Deploy app and build
```bash
sudo mkdir -p /var/www/qrv
sudo rsync -av --delete /workspace/execution-interface/ /var/www/qrv/
cd /var/www/qrv
npm ci
npm run build
cd /var/www/qrv/onegodian-identity-engine
npm ci
npm run build
```

## 3) Detect runtime ports
```bash
cd /var/www/qrv
bash scripts/detect-runtime-ports.sh
```

Expected configured ports:
- qrv-registry: **4101**
- qrv-api: **4102**
- issuer-qrv: **4103**

## 4) Start with PM2
```bash
cd /var/www/qrv
pm2 start deploy/ecosystem.config.cjs
pm2 save
pm2 startup systemd -u $USER --hp $HOME
pm2 status
```

## 5) Install nginx site configs
```bash
sudo mkdir -p /var/www/certbot
sudo cp /var/www/qrv/deploy/nginx/*.conf /etc/nginx/sites-available/
sudo ln -sf /etc/nginx/sites-available/registry.qrv.network.conf /etc/nginx/sites-enabled/registry.qrv.network.conf
sudo ln -sf /etc/nginx/sites-available/api.qrv.network.conf /etc/nginx/sites-enabled/api.qrv.network.conf
sudo ln -sf /etc/nginx/sites-available/issuer.qrv.network.conf /etc/nginx/sites-enabled/issuer.qrv.network.conf
sudo ln -sf /etc/nginx/sites-available/verify.qrv.network.conf /etc/nginx/sites-enabled/verify.qrv.network.conf
sudo ln -sf /etc/nginx/sites-available/api.quantumohi.com.conf /etc/nginx/sites-enabled/api.quantumohi.com.conf
sudo nginx -t
sudo systemctl reload nginx
```

## 6) Issue SSL certs (Let’s Encrypt)
```bash
sudo certbot --nginx -d registry.qrv.network -d api.qrv.network -d issuer.qrv.network -d verify.qrv.network -d api.quantumohi.com --redirect -m admin@qrv.network --agree-tos --no-eff-email
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
sudo certbot renew --dry-run
```

## 7) Smoke checks (must all return 200)
```bash
curl -i https://registry.qrv.network/healthz
curl -i https://api.qrv.network/healthz
curl -i https://issuer.qrv.network/healthz
curl -i https://verify.qrv.network/healthz
curl -i https://api.quantumohi.com/healthz
SMOKE_API_KEY="<PROD_API_KEY>" node /var/www/qrv/scripts/smoke-check-qrv.mjs
curl -i https://verify.qrv.network/verify/QRV-SMOKE-<TIMESTAMP>
```

## Acceptance gates
- all domains return HTTP 200
- `/healthz` and `/readyz` return ok payloads
- no 503 responses in smoke-check output
- verify endpoint resolves a real QRVID created during smoke run (`QRV-SMOKE-*`) or a production-issued ID
