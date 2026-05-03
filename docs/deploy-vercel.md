# Deploying `app.onegodian.com` to Vercel

1. Import this repository into Vercel.
2. Configure project settings:
   - Framework Preset: `Next.js`
   - Root Directory: `apps/web`
   - Build Command: `npm run build`
   - Output Directory: `.next`
3. Add environment variables from `.env.example`.
4. Deploy.
5. Attach the custom domain `app.onegodian.com`.

## DNS
Create this DNS record:
- Type: `CNAME`
- Name: `app`
- Value: `cname.vercel-dns.com`
