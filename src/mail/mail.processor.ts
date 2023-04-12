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

@Processor('mailsend')
export class MailProcessor {
  constructor(private readonly mailService: MailService) {}

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processor:@OnQueueActive - Processing job ${job.id} of type ${
        job.name
      }. Data: ${JSON.stringify(job.data)}`,
    );
  }

  @OnQueueCompleted()
  onComplete(job: Job) {
    console.log(
      `Processor:@OnQueueCompleted - Completed job ${job.id} of type ${
        job.name
      }. Data: ${JSON.stringify(job.data)}`,
    );
  }

  @OnQueueFailed()
  onError(job: Job<any>, error) {
    console.log(
      `Processor:@OnQueueFailed - Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }

  @Process('forgot-password')
  async forgotPassword(job: Job<SendMailConfig>) {
    console.log('Processor:@Process - Sending confirmation email.');

    try {
      const result = await this.mailService.sendMail(job.data);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
