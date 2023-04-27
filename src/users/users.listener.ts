import { defaultCategories } from '@default';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { User } from '@prisma/client';
import { Role } from 'authorization/roles';
import { PrismaService } from 'nestjs-prisma';
import { USER_CREATED } from 'src/constant/events';
import { MailService } from 'src/mail/mail.service';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class UserEventListener {
  logger = new Logger('UserEventListener');
  constructor(
    private prisma: PrismaService,
    private roleService: RolesService,
    private mailService: MailService,
  ) {}
  @OnEvent(USER_CREATED)
  async setupUserBasicData(payload: User) {
    try {
      this.roleService.assignRoleToUser(payload.id, [Role.Client]);
      this.mailService.sendWelcomeEmail(payload.email, payload.name);
      await this.prisma.category.createMany({
        data: defaultCategories.map((category) => ({
          ...category,
          userId: payload.id,
        })),
      });

      this.logger.log(
        `@userCreated - User ${payload.id} has been setup successfully.`,
      );
    } catch (err) {
      console.log(err);
    }
  }
}
