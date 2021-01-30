import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

if (!process.env.SERVER_DATABASE_NAME) {
  throw new Error('Missing SERVER_DATABASE_NAME');
}

const DATABASE_NAME = process.env.SERVER_DATABASE_NAME;

const reset = async (): Promise<void> => {
  const prisma = new PrismaClient();

  try {
    console.log(`Dropping ${DATABASE_NAME} if exists ...`);
    await prisma.$executeRaw(`DROP DATABASE IF EXISTS ${DATABASE_NAME};`);
    console.log('*** Finished resetting...');
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};
reset();
