import { createUserAction } from '../create-user-action';
import { PrismaClient } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import fetch from 'node-fetch';
import { createServer } from '../../create-server';

export interface CreateServerParams {
  prisma: PrismaClient;
}

describe('createUserAction - Functional test', () => {
  let server: any;
  let prisma: PrismaClient;
  const internalConfig: any = {};
  const port = 1778;
  const url = `http://localhost:${port}/users`;

  beforeAll(async (done) => {
    prisma = new PrismaClient();
    server = createServer({ prisma });
    const instance = server.listen(port);
    internalConfig.server = instance;
    done();
  });

  afterAll(async (done) => {
    internalConfig.server.close();
    await prisma.$disconnect();
    done();
  });

  describe('createUser', () => {
    it('Should create new user correctly', async () => {
      let email = `${uuid()}@test.com`;
      const body = {
        email: email,
      };

      const res = await fetch(url, {
        method: 'post',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(body),
      });

      const newUser = await res.json();
      expect(newUser.email).toBe(email);
    });

    it('Should throw error if  email existed', async () => {
      const email = `${uuid()}@test.com`;
      const body = {
        email: email,
      };
      const newUser = await createUserAction({ prisma, email });
      expect(newUser.email).toBe(email);

      try {
        const res = await fetch(url, {
          method: 'post',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify(body),
        });

        await res.json();
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
