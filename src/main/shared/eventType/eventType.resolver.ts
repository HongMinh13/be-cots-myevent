import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EventTypeService } from './eventType.service';
import { ResponseMessageBase } from '@/common/interfaces/returnBase';
import { CreateEventTypeRequest } from './dto/request/createEventType.request';
import { EventTypesData } from './dto/response/eventTypes.response';
import { QueryFilterDto } from '@/common/dtos/queryFilter';
import { ROLE } from '@/common/constant';
import { Auth } from '@/decorators/auth.decorator';
import { Roles } from '@/decorators/roles.decorator';

@Resolver()
export class EventTypeResolver {
  constructor(private service: EventTypeService) {}

  @Query(() => EventTypesData)
  async getEventTypes(
    @Args('input') input: QueryFilterDto,
  ): Promise<EventTypesData> {
    return this.service.getEventTypes(input);
  }

  @Auth(['Roles'])
  @Roles(ROLE.Admin)
  @Mutation(() => ResponseMessageBase)
  async createEventType(
    @Args('input') input: CreateEventTypeRequest,
  ): Promise<ResponseMessageBase> {
    return this.service.createEvent(input);
  }
}
