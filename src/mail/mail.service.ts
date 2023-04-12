import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(email: string, name: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Greeting from NestJS NodeMailer',
        template: 'email',
        context: {
          name: name,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }
}
