import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserService } from './user.service';

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

  @Put('/:userId')
  public async updateUser(
    @Param('userId') id: number,
    @Body() userDto: UpdateUserDto,
  ) {
    return await this.userService.updateUser(id, userDto);
  }

  @Delete('/:userId')
  public async deleteUser(@Param('userId') id: number) {
    await this.userService.deleteUser(id);
  }
}
