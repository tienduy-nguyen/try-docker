import { Module } from '@nestjs/common';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [],
})
export class UserModule {}
