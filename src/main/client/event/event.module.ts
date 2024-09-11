import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventResolver } from './event.resolver';
import { EventRepository } from '@/db/repositories/event.repository';

@Module({
  providers: [EventResolver, EventService, EventRepository],
})
export class EventModule {}
