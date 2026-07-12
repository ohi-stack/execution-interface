import { readFileSync, existsSync } from 'node:fs';
const sitemap=readFileSync('public/sitemap.xml','utf8');
if(sitemap.includes('/admin')||sitemap.includes('/dashboard')) throw new Error('private routes in sitemap');
for (const p of ['src/app/login/page.tsx','src/app/logout/page.tsx','src/app/admin/page.tsx','src/app/dashboard/page.tsx']) if(!existsSync(p)) throw new Error(`${p} missing`);
console.log('smoke ok');
