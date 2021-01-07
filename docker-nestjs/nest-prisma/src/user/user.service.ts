import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User as UserModel, Post as PostModel } from '@prisma/client';

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

export type CreateUserDto = {
  email: string;
  name?: string | null;
};

export type UpdateUserDto = {
  email?: string;
  name?: string;
};

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  public async findUserById(id: number): Promise<UserModel | null> {
    return await this.prismaService.user.findUnique({
      where: { id: id },
    });
  }
  public async findUserByEmail(email: string): Promise<UserModel | null> {
    return await this.prismaService.user.findUnique({
      where: { email: email },
    });
  }

  public async findUserUnique(
    inputUnique: UserWhereUniqueInput,
  ): Promise<UserModel | null> {
    return await this.prismaService.user.findUnique({
      where: inputUnique,
    });
  }

  public async getUsers(params: FindManyUserArgs) {
    const { skip, take, orderBy } = params;
    return await this.prismaService.user.findMany({
      skip,
      take,
      orderBy,
    });
  }

  public async createUser(userDto: CreateUserDto): Promise<UserModel> {
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
      where: { id: id },
    });
  }

  public async deleteUser(id: number): Promise<void> {
    await this.prismaService.user.delete({ where: { id: id } });
  }
}
