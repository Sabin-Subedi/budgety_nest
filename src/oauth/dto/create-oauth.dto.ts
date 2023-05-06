import { ApiProperty } from '@nestjs/swagger';
import { OAuthProvider } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateOauthDto {
  constructor(data: CreateOauthDto) {
    Object.assign(this, data);
  }
  @IsString()
  @IsNotEmpty()
  @IsEmail()
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
  @MinLength(4)
  @ApiProperty({ minLength: 4, required: true })
  username: string;

  @IsNotEmpty()
  OAuthProvider: OAuthProvider;

  @IsNotEmpty()
  @IsString()
  OAuthProviderId: string;
}
