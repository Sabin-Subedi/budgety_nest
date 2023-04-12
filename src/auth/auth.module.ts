import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'nestjs-prisma';
import { TokenModule } from 'src/token/token.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [UsersModule, TokenModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService, UsersService, PrismaService],
  exports: [AuthService],
})
export class AuthModule {}
