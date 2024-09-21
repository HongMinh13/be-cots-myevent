import { Module } from '@nestjs/common';
import { EventTypeResolver } from './eventType.resolver';
import { EventTypeService } from './eventType.service';
import { EventTypeRepository } from '@/db/repositories/eventType.repository';

@Module({
  providers: [EventTypeResolver, EventTypeService, EventTypeRepository],
})
export class EventTypeModule {}
