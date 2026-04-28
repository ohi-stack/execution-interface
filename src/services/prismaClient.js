let prisma = null;
let initialized = false;

export const getPrismaClient = async () => {
  if (!process.env.DATABASE_URL) return null;
  if (initialized) return prisma;
  initialized = true;

  try {
    const { PrismaClient } = await import('@prisma/client');
    prisma = new PrismaClient();
    return prisma;
  } catch {
    prisma = null;
    return null;
  }
};
