import express, { Express } from 'express';
import { PrismaClient } from '@prisma/client';
import { createUserAction } from './actions/create-user-action';

export interface CreateServerParams {
  prisma: PrismaClient;
}

export const createServer = ({ prisma }: CreateServerParams): Express => {
  const server = express();

  server.get('/new-user/:email', async (req, res) => {
    const { email } = req.params;

    try {
      await createUserAction({ prisma, email });
      return res.status(200).send('ok');
    } catch (e) {
      res.status(403).send(`Cannot create new user for email: ${email}`);
    }
  });

  return server;
};
