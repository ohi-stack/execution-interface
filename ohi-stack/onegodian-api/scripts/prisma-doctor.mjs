#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import os from 'node:os';

const cwd = process.cwd();
const rootPkg = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf8'));

const prismaCliVersion = rootPkg.devDependencies?.prisma ?? 'not-declared';
const prismaClientVersion = rootPkg.dependencies?.['@prisma/client'] ?? 'not-declared';

const installedPrismaCliPkg = join(cwd, 'node_modules', 'prisma', 'package.json');
const installedPrismaClientPkg = join(cwd, 'node_modules', '@prisma', 'client', 'package.json');

const installedPrismaCliVersion = existsSync(installedPrismaCliPkg)
  ? JSON.parse(readFileSync(installedPrismaCliPkg, 'utf8')).version
  : 'not-installed';

const installedPrismaClientVersion = existsSync(installedPrismaClientPkg)
  ? JSON.parse(readFileSync(installedPrismaClientPkg, 'utf8')).version
  : 'not-installed';

const generatedClientCandidates = [
  join(cwd, 'node_modules', '.prisma', 'client', 'default.js'),
  join(cwd, 'node_modules', '.prisma', 'client', 'index.js'),
  join(cwd, 'node_modules', '@prisma', 'client', 'default.js')
];

const generatedClientExists = generatedClientCandidates.some((file) => existsSync(file));

console.log(`Node version: ${process.version}`);
console.log(`Prisma CLI (declared): ${prismaCliVersion}`);
console.log(`Prisma CLI (installed): ${installedPrismaCliVersion}`);
console.log(`@prisma/client (declared): ${prismaClientVersion}`);
console.log(`@prisma/client (installed): ${installedPrismaClientVersion}`);
console.log(`DATABASE_URL present: ${Boolean(process.env.DATABASE_URL)}`);
console.log(`Platform: ${process.platform} ${os.release()} (${process.arch})`);
console.log(`Generated client exists: ${generatedClientExists}`);
