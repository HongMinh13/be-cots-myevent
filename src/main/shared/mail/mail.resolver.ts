import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SendEmailRequest } from './dto/request/getFileFromS3.request';
import { MailService } from './mail.service';

@Resolver()
export class MailResolver {
  constructor(private service: MailService) {}

  @Mutation(() => String)
  async sendEmail(@Args('input') input: SendEmailRequest) {
    await this.service.processEmails(input);
    return 'Emails sent successfully';
  }
}
