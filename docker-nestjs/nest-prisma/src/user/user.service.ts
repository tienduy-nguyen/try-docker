import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User as UserModel } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  public async getUserById(id: number): Promise<UserModel | null> {
    return await this.prismaService.user.findUnique({
      where: { id: Number(id) },
    });
  }
  public async getUserByEmail(email: string): Promise<UserModel | null> {
    return await this.prismaService.user.findUnique({
      where: { email: email },
    });
  }

  public async getUserUnique(
    inputUnique: UserWhereUniqueInput,
  ): Promise<UserModel | null> {
    return await this.prismaService.user.findUnique({
      where: inputUnique,
    });
  }

  public async getUsers() {
    return await this.prismaService.user.findMany({
      include: {
        posts: {
          orderBy: {
            title: 'asc',
          },
          select: {
            title: true,
          },
        },
      },
      orderBy: [
        {
          id: 'asc',
        },
        {
          email: 'asc',
        },
      ],
    });
  }

  public async createUser(userDto: CreateUserDto): Promise<UserModel> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: userDto.email,
      },
    });
    if (user) {
      throw new ConflictException(
        `User with email ${userDto.email} already exists`,
      );
    }
    return this.prismaService.user.create({
      data: userDto,
    });
  }

  public async updateUser(
    id: number,
    userDto: UpdateUserDto,
  ): Promise<UserModel> {
    return await this.prismaService.user.update({
      data: userDto,
      where: { id: Number(id) },
    });
  }

  public async deleteUser(id: number): Promise<void> {
    await this.prismaService.user.delete({ where: { id: Number(id) } });
  }
}

export type UserWhereUniqueInput = {
  id?: number | null;
  email?: string | null;
};
export type SortOrder = {
  asc: 'asc';
  desc: 'desc';
};
export type FindManyUserArgs = {
  skip?: number;
  take?: number;
  include?: {
    posts: {
      orderBy: {
        title: 'asc';
      };
      select: {
        title: true;
      };
    };
  };
  orderBy?: [
    {
      id: 'asc';
    },
    {
      email: 'asc';
    },
  ];
};
