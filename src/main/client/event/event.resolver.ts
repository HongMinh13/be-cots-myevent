import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EventService } from './event.service';
import { QueryFilterDto } from '@/common/dtos/queryFilter';
import { EventData } from './dto/respone/event.response';
import { GetEventsRequest } from './dto/request/getEvents.request';
import { EventsData } from './dto/respone/events.response';


@Resolver()
export class EventResolver {
  constructor(private service: EventService) {}

  @Query(() => EventsData)
  async getEvents(@Args('input') input: GetEventsRequest) {
    return this.service.getEvents(input);
  }
  @Query(() => EventData)
  async getEventsTemplate(@Args('input') input: QueryFilterDto) {
    return this.service.getEvents(input);
  }

  @Query(() => EventData)
  async getEventById(@Args('id') id: string) {
    return this.service.getEventById(id);
  }


}
