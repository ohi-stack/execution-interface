import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const SCAN_DIRS = ['src', 'scripts', 'test', 'public/js'];
const JS_EXTENSIONS = new Set(['.js', '.mjs']);

const walk = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name.startsWith('.')) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }

    if (JS_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
};

const run = async () => {
  const files = [];

  for (const scanDir of SCAN_DIRS) {
    files.push(...(await walk(path.join(ROOT, scanDir))));
  }

  files.push(path.join(ROOT, 'server.js'));

  const failures = [];
  for (const file of files) {
    const result = spawnSync(process.execPath, ['--check', file], { stdio: 'pipe', encoding: 'utf8' });
    if (result.status !== 0) {
      failures.push({ file, output: result.stderr || result.stdout });
    }
  }

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(`\nSyntax issue in ${path.relative(ROOT, failure.file)}\n${failure.output}`);
    }
    process.exit(1);
  }

  console.log(`Lint passed: ${files.length} JavaScript files validated.`);
};

run().catch((error) => {
  console.error('Lint failed unexpectedly:', error);
  process.exit(1);
});
