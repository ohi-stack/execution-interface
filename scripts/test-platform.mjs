import { readFileSync } from 'node:fs';
const nav=readFileSync('src/data/platform.ts','utf8');
for (const label of ['OMOS','OHI','Models','Tools','Artifacts','Docs','Shop']) if(!nav.includes(`label: '${label}'`)) throw new Error(`missing ${label}`);
if(nav.includes("label: 'Admin'")) throw new Error('admin in public nav');
const mw=readFileSync('src/middleware.ts','utf8');
if(!mw.includes('roleRank.operator')) throw new Error('admin operator check missing');
const css=readFileSync('src/app/globals.css','utf8');
if(!css.includes('prefers-reduced-motion') || !css.includes('min-height: 44px')) throw new Error('mobile/accessibility guards missing');
console.log('platform tests ok');
