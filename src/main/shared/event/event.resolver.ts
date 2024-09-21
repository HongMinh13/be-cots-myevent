import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EventService } from './event.service';
import { ResponseMessageBase } from '@/common/interfaces/returnBase';
import { CreateEventRequest } from './dto/request/createEvent.request';
import { EventsData } from './dto/response/events.response';
import { QueryFilterDto } from '@/common/dtos/queryFilter';
import { EventData } from './dto/response/event.response';
import { Context, GetContext } from '@/decorators/user.decorator';
import {
  CreateEventTemplateRequest,
  UpdateEventTemplateRequest,
} from './dto/request/createEventTemplate.request';
import { Auth } from '@/decorators/auth.decorator';
import { ROLE } from '@/common/constant';
import { Roles } from '@/decorators/roles.decorator';
import { GetEventsRequest } from './dto/request/getEvents.request';

@Resolver()
export class EventResolver {
  constructor(private service: EventService) {}

  @Query(() => EventsData)
  async getEvents(@Args('input') input: GetEventsRequest) {
    return this.service.getEvents(input);
  }

  @Query(() => EventsData)
  async getEventsTemplate(@Args('input') input: QueryFilterDto) {
    return this.service.getEventsTemplate(input);
  }

  @Query(() => EventData)
  async getEventById(@Args('id') id: string) {
    return this.service.getEventById(id);
  }

  @Auth(['Roles'])
  @Mutation(() => ResponseMessageBase)
  async createEvent(@Args('input') input: CreateEventRequest) {
    return this.service.createEvent(input);
  }

  @Auth(['Roles'])
  @Roles(ROLE.Admin)
  @Mutation(() => ResponseMessageBase)
  async createEventTemplate(
    @Args('input') input: CreateEventTemplateRequest,
    @GetContext() ctx: Context,
  ) {
    return this.service.createEventTemplate(input, ctx);
  }

  @Auth(['Roles'])
  @Roles(ROLE.Admin)
  @Mutation(() => ResponseMessageBase)
  async updateEventTemplate(@Args('input') input: UpdateEventTemplateRequest) {
    return this.service.updateEventTemplate(input);
  }

  @Auth(['Roles'])
  @Roles(ROLE.Admin)
  @Mutation(() => ResponseMessageBase)
  async deleteEventTemplate(@Args('id') id: string) {
    return this.service.deleteEventTemplate(id);
  }
}
