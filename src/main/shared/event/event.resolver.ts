import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EventService } from './event.service';
import { QueryFilterDto } from '@/common/dtos/queryFilter';
import { EventData } from './dto/respone/event.response';

@Resolver()
export class EventResolver {
  constructor(private service: EventService) {}

  @Query(() => EventData)
  async getEvents(@Args('input') input: QueryFilterDto) {
    return this.service.getEvents(input);
  }

  @Query(() => EventData)
  async getEventById(@Args('id') id: string) {
    return this.service.getEventById(id);
  }

}
