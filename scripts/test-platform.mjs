import { readFileSync, existsSync } from 'node:fs';
const odc=readFileSync('src/lib/odc.ts','utf8');
for(const value of ['OneGodian Digital Coin','0x9eee1e3615efe0374a7588d2760db5ffb2d5ce98','777000000000','Ethereum Mainnet']) if(!odc.includes(value)) throw new Error(`missing canonical value: ${value}`);
for(const route of ['health','manifest','token','contract','supply','status','ecosystem','announcements','docs']) if(!existsSync(`src/app/api/${route}/route.ts`)) throw new Error(`missing API: ${route}`);
for(const status of ['Production','In Development','Private Beta','Under Review','Planned','Deprecated']) if(!odc.includes(status)) throw new Error(`missing feature status: ${status}`);
const middleware=readFileSync('src/middleware.ts','utf8'); for(const control of ['Content-Security-Policy','Strict-Transport-Security','rate_limited','X-Request-ID']) if(!middleware.includes(control)) throw new Error(`missing security control: ${control}`);
const wallet=readFileSync('src/app/dashboard/wallet-status/page.tsx','utf8'); if(!wallet.includes('Not Released')||!wallet.includes('seed-phrase')) throw new Error('wallet release boundary missing');
console.log('ODC platform tests ok');
