import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @ApiProperty({ required: false })
  name?: string;

  @IsString()
  @ApiProperty()
  email: string;
}
