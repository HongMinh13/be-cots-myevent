import { getPaginationResponse } from '@/common/base/getPaginationResponse';
import { Injectable } from '@nestjs/common';
import { GetEmailSendLogRequest } from './dto/request/getEmailSendLog.request';
import { EmailSendLog } from '@/db/entities/emailSendLog.entity';
import { EmailSendLogsData } from './dto/response/emailSendLogDatas.response';

@Injectable()
export class EmailSendLogService {
  public async getEmailSendLogsByContractId(
    input: GetEmailSendLogRequest,
  ): Promise<EmailSendLogsData> {
    const qb = EmailSendLog.createQueryBuilder('emailSendLog')
      .leftJoinAndSelect('emailSendLog.guests', 'guests')
      .where('emailSendLog.contractId = :contractId', {
        contractId: input.contractId,
      })
      // .addSelect('row_number() OVER ()', 'emailSendLog_order')
      .orderBy('emailSendLog.createdAt');

    const emailSendLogs = await getPaginationResponse(qb, input);

    return emailSendLogs;
  }
}
