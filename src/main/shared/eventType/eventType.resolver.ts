import { Resolver } from '@nestjs/graphql';
import { EventTypeService } from './eventType.service';
import { EventType } from '@/db/entities/EventType';

@Resolver()
export class EventTypeResolver {
  constructor(private service: EventTypeService) {}
}
