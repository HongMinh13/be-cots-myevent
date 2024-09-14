import { Resolver } from '@nestjs/graphql';
import { EventTypeService } from './eventType.service';

@Resolver()
export class EventTypeResolver {
  constructor(private service: EventTypeService) {}
}
