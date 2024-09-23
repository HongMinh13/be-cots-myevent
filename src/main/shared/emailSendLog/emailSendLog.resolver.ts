import { Auth } from '@/decorators/auth.decorator';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { EmailSendLogService } from './emailSendLog.service';
import { GetEmailSendLogRequest } from './dto/request/getEmailSendLog.request';
import { EmailSendLogsData } from './dto/response/emailSendLogDatas.response';

@Auth(['Roles'])
@Resolver()
export class EmailSendLogResolver {
  constructor(private service: EmailSendLogService) {}

  @Query(() => EmailSendLogsData)
  async getEmailSendLogsByContractId(
    @Args('input') input: GetEmailSendLogRequest,
  ) {
    return this.service.getEmailSendLogsByContractId(input);
  }
}
