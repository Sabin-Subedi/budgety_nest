import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ required: true })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({
    minLength: 3,
    required: true,
  })
  name: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  @ApiProperty({ minLength: 8, required: true })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @ApiProperty({ minLength: 4, required: true })
  username: string;
}
