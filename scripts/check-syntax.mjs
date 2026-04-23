import { spawnSync } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const rootDirs = ['src'];
const explicitFiles = ['server.js'];

const jsFiles = [];

const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const target = join(dir, name);
    const stat = statSync(target);
    if (stat.isDirectory()) {
      walk(target);
      continue;
    }
    if (target.endsWith('.js')) jsFiles.push(target);
  }
};

for (const dir of rootDirs) walk(dir);
for (const file of explicitFiles) jsFiles.push(file);

for (const file of jsFiles) {
  const result = spawnSync(process.execPath, ['--check', file], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
}

console.log(`[check] Syntax validated for ${jsFiles.length} files.`);

