import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User as UserModel, Post as PostModel } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  public async findUser(
    userInput: UserWhereUniqueInput,
  ): Promise<User | null> {}
}
