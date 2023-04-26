import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { BullModule } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
import {
  BASE_PATH,
  EMAIL_SMTP_HOST,
  EMAIL_SMTP_PASSWORD,
  EMAIL_SMTP_PORT,
  EMAIL_SMTP_USER,
} from '@constants';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailProcessor } from './mail.processor';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: EMAIL_SMTP_HOST,
          port: +EMAIL_SMTP_PORT,
          secure: false,
          auth: {
            user: EMAIL_SMTP_USER,
            pass: EMAIL_SMTP_PASSWORD,
          },
        },
        defaults: {
          from: 'noreply@budgety.com',
        },
        template: {
          adapter: new HandlebarsAdapter(),
          dir: join(BASE_PATH, 'public', 'templates'),
          options: {
            strict: true,
          },
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'mailsend',
    }),
  ],
  providers: [MailService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}
