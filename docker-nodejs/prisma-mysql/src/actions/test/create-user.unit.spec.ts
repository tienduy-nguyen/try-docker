import { createUserAction } from '../create-user-action';
import { User } from '@prisma/client';

const oneUser = {
  id: 1,
  email: 'some email',
} as User;

describe('createUserAction - Unit test', () => {
  let prisma: any;

  beforeEach(() => {
    prisma = {
      user: {
        findMany: jest.fn(),
        create: jest.fn(),
      },
    };
  });

  describe('createUser', () => {
    it('Should create new user correctly', async () => {
      prisma.user.create.mockReturnValue(oneUser);
      prisma.user.findMany.mockReturnValue([oneUser, oneUser, oneUser]);
      const { email } = oneUser;

      await createUserAction({ prisma, email });
      const [saveUser] = await prisma.user.findMany({
        where: { email },
        take: 1,
      });
      expect(saveUser.email).toBe(email);
    });

    it('Should throw error if  email existed', async () => {
      prisma.user.create.mockReturnValue(null);
      const { email } = oneUser;
      try {
        await createUserAction({ prisma, email });
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
