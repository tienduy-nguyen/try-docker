import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  public async getUsers() {
    return await this.userService.getUsers();
  }
  @Get('/:userId')
  public async getUserById(@Param('userId') id: number) {
    return await this.userService.getUserById(id);
  }

  @Post()
  public async createUser(@Body() userDto: CreateUserDto) {
    return await this.userService.createUser(userDto);
  }

  @Put('/:id')
  public async updateUser(
    @Param('id') id: number,
    @Body() userDto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateUser(id, userDto);
  }

  @Delete('/:userId')
  public async deleteUser(@Param('userId') id: number) {
    await this.userService.deleteUser(id);
  }
}
