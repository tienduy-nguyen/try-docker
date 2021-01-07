import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto, UserService } from './user.service';

@Controller('api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  public async GetUsers() {
    return await this.userService.getUsers();
  }

  @Post()
  public async CreateUser(@Body() userDto: CreateUserDto) {
    return await this.userService.createUser(userDto);
  }
}
