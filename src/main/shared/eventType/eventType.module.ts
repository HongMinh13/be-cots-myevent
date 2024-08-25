import { Module } from '@nestjs/common';
import { EventTypeResolver } from './eventType.resolver';
import { EventTypeService } from './eventType.service';

@Module({
  providers: [EventTypeResolver, EventTypeService],
})
export class EventTypeModule {}
