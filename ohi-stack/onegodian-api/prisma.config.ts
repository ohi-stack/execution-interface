import 'dotenv/config';

import { defineConfig } from 'prisma/config';

const databaseUrl = process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/onegodian';

export default defineConfig({
  experimental: {
    adapter: true
  },
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations'
  },
  engine: 'js',
  datasource: {
    url: databaseUrl
  },
  seed: 'tsx prisma/seed.ts'
});
