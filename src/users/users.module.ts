import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'nestjs-prisma';
import { UserEventListener } from './users.listener';
import { RolesModule } from 'src/roles/roles.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [RolesModule, MailModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, UserEventListener],
  exports: [UsersService, UserEventListener],
})
export class UsersModule {}
