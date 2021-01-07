import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsString()
  @ApiProperty({ required: false })
  name?: string;

  @IsString()
  @ApiProperty()
  email: string;
}
