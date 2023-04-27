import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { MailService } from './mail.service';
import { Job } from 'bull';
import { SendMailConfig } from './mail.interface';
import { Logger } from '@nestjs/common';

@Processor('mailsend')
export class MailProcessor {
  logger = new Logger('MailProcessor');
  constructor(private readonly mailService: MailService) {}

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(
      `MailProcessor:@OnQueueActive - Processing job ${job.id} of type ${
        job.name
      }. Data: ${JSON.stringify(job.data)}`,
    );
  }

  @OnQueueCompleted()
  onComplete(job: Job) {
    this.logger.log(
      `MailProcessor:@OnQueueCompleted - Completed job ${job.id} of type ${
        job.name
      }. Data: ${JSON.stringify(job.data)}`,
    );
  }

  @OnQueueFailed()
  onError(job: Job<any>, error) {
    this.logger.error(
      `MailProcessor:@OnQueueFailed - Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }

  @Process('send-mail')
  async sendMail(job: Job<SendMailConfig>) {
    this.logger.log('MailProcessor:@Process - Sending email.');

    try {
      const result = await this.mailService.sendMail(job.data);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
