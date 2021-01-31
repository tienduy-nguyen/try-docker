import { createUserAction } from '../create-user-action';
import { v4 as uuid } from 'uuid';
import { PrismaClient } from '@prisma/client';

describe('createUserAction - Integration test', () => {
  let prisma: any;

  beforeAll(() => {
    prisma = new PrismaClient();
  });

  afterAll(async (done) => {
    await prisma.$disconnect();
    done();
  });

  describe('createUser', () => {
    it('Should create new user correctly', async () => {
      const email = `${uuid()}@test.com`;

      await createUserAction({ prisma, email });
      const [saveUser] = await prisma.user.findMany({
        where: { email },
        take: 1,
      });
      expect(saveUser.email).toBe(email);
    });

    it('Should throw error if  email existed', async () => {
      const email = `${uuid()}@test.com`;

      await createUserAction({ prisma, email });
      const [savedUser] = await prisma.user.findMany({
        where: { email },
        take: 1,
      });

      expect(savedUser.email).toBe(email);

      await expect(() => createUserAction({ prisma, email })).rejects.toThrow(
        Error
      );
    });
  });
});
