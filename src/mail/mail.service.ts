import { MailerService } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { SendMailConfig } from './mail.interface';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    @InjectQueue('mailsend')
    private mailQueue: Queue,
  ) {}

  public async sendMail({
    to,
    subject,
    template,
    context,
    ...props
  }: SendMailConfig) {
    try {
      const response = await this.mailerService.sendMail({
        to,
        subject,
        template,
        context,
        ...props,
      });

      return response;
    } catch (err) {
      console.log(err);
    }
  }

  addEmailToQueue(queueName: string, data: SendMailConfig) {
    return this.mailQueue.add(queueName, data, {
      removeOnComplete: true,
      attempts: 3,
    });
  }

  sendForgotPasswordEmail(email: string) {
    return this.addEmailToQueue('send-mail', {
      to: email,
      subject: 'Password Reset',
      template: 'forgot-password',
      context: {
        name: 'John Doe',
        url: 'http://localhost:3000/reset-password',
        email,
      },
    });
  }

  sendWelcomeEmail(email: string, name: string) {
    return this.addEmailToQueue('send-mail', {
      to: email,
      subject: 'Welcome to Budgety',
      template: 'welcome',
      context: {
        name,
        email,
      },
    });
  }
}
