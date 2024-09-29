import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailService } from './mail.service';

@Processor('email')
export class MailProcessor {
  constructor(private readonly mailService: MailService) {}

  @Process('send-email')
  async handleSendMail(job: Job) {
    const { email, guestId } = job.data;

    console.log('Processing email', email, guestId);

    await this.mailService.sendEmail(email, guestId);
  }
}
