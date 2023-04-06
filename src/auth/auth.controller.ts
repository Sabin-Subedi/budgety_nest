import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Public } from '@permissions';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  saltOrRounds = 10;

  @Post('login')
  signIn(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.signIn(createAuthDto.email, createAuthDto.password);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  async signUp(@Body() createAuthDto: CreateUserDto) {
    return new UserEntity(await this.authService.signUp(createAuthDto));
  }

  @Post('refresh')
  async refresh(@Body() createAuthDto: any) {
    return this.authService.refreshToken(createAuthDto.refresh_token);
  }
}