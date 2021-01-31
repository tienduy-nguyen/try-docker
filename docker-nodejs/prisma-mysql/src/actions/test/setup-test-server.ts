import { Prisma, PrismaClient } from '@prisma/client';
import { createServer } from 'src/create-server';

export interface TestServerConfig {
  prisma: PrismaClient;
}

const port = 1778;

export const setupTestServer = (): TestServerConfig => {
  const prisma = new PrismaClient();
  const server = createServer({ prisma });

  const internalConfig: any = {};

  beforeAll(async (done) => {
    const instance = server.listen({ port: port });
    internalConfig.server = instance;
    done();
  });

  afterAll(async (done) => {
    internalConfig.server.close();
    await prisma.$disconnect();
    done();
  });

  return {
    prisma,
  };
};
