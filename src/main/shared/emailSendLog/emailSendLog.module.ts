import { Module } from '@nestjs/common';
import { EmailSendLogResolver } from './emailSendLog.resolver';
import { EmailSendLogService } from './emailSendLog.service';

@Module({
  providers: [EmailSendLogResolver, EmailSendLogService],
})
export class EmailSendLogModule {}
