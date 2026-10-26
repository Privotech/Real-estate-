import { PrismaClient } from '@prisma/client';

function getCleanDatabaseUrl(): string | undefined {
  const raw = process.env.DATABASE_URL;
  if (!raw) return undefined;
  const match = raw.match(/postgres(?:ql)?:\/\/[^\s'\"<>()]+/);
  return match ? match[0] : raw;
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const cleanUrl = getCleanDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: cleanUrl
      ? {
          db: {
            url: cleanUrl,
          },
        }
      : undefined,
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
export default prisma;
