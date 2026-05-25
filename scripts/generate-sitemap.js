const fs = require('fs');
const path = require('path');

const base = 'https://omos.onegodian.com';
const routes = ['/', '/docs', '/tools', '/tools/bridge-builder', '/tools/belief-mapper', '/artifacts', '/shop', '/contact', '/legal', '/dashboard'];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((route)=>`  <url><loc>${base}${route}</loc></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(__dirname, '..', 'public', 'sitemap.xml'), xml);
console.log('sitemap generated');
