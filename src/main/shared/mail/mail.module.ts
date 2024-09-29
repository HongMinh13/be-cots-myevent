import { Module } from '@nestjs/common';
// import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { BullModule } from '@nestjs/bull';
import { configuration } from '@/config';
import { EmailService } from '@/service/smtp/service';
import { MailProcessor } from './mail.processor';
import { MailResolver } from './mail.resolver';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { BullAdapter } from '@bull-board/api/bullAdapter';

@Module({
  imports: [
    BullModule.forRoot({
      redis: configuration.redisUrl,
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    BullModule.registerQueue({
      name: 'email',
    }),
    BullBoardModule.forFeature({
      name: 'email',
      adapter: BullAdapter,
    }),
  ],
  providers: [MailResolver, MailService, MailProcessor, EmailService],
  // controllers: [MailController],
})
export class MailModule {}
