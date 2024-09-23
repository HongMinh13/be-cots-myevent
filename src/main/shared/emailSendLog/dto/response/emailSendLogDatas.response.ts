import { PaginationInterface } from '@/common/interfaces/pagination';
import { ObjectType } from '@nestjs/graphql';
import { EmailSendLogData } from './emailSendLogData.response';

@ObjectType({ isAbstract: true })
export class EmailSendLogsData extends PaginationInterface<EmailSendLogData>(
  EmailSendLogData,
) {}
