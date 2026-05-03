const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient();
const planets = Array.from({ length: 25 }, (_, i) => ({ code: `ODIN-PR-${String(i + 1).padStart(2, '0')}`, name: `Planet ${i + 1}`, description: `ODIN Planetary Registry record ${i + 1}` }));
async function main(){ for (const p of planets){ await prisma.planet.upsert({ where:{code:p.code}, update:p, create:p }); } }
main().finally(()=>prisma.$disconnect());
