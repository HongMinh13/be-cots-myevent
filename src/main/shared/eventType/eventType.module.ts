import { Module } from '@nestjs/common';
import { EventTypeResolver } from './eventTypes.resolver';
import { EventTypeService } from './eventTypes.service';
import { EventTypeRepository } from '@/db/repositories/eventType.repository';

@Module({
  providers: [EventTypeResolver, EventTypeService, EventTypeRepository],
})
export class EventTypeModule {}
