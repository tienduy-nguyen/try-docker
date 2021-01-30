import express, { Express } from 'express';
import { PrismaClient } from '@prisma/client';
import { createUserAction } from './actions/create-user-action';

export interface CreateServerParams {
  prisma: PrismaClient;
}

export const createServer = ({ prisma }: CreateServerParams): Express => {
  const server = express();
  server.use(express.json());

  server.get('/', (req, res) => {
    return res.status(200).send('Hi there!');
  });
  server.get('/users', (req, res) => {
    return res.status(200).send(['user1', 'user2']);
  });

  server.post('/users', async (req, res) => {
    const { email } = req.body;
    try {
      const user = await createUserAction({ prisma, email });
      return res.status(200).send(user);
    } catch (e) {
      res.status(403).send(e.message);
    }
  });

  return server;
};
