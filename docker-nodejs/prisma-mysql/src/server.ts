import { PrismaClient } from '@prisma/client';
import { createServer } from './create-server';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.development' });
const prisma = new PrismaClient();

const server = createServer({ prisma });

server.listen(1776, () => {
  console.log(`Example app listening at http://localhost:1776`);
});
