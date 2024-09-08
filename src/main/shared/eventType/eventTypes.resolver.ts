import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EventTypeService } from './eventTypes.service';
import { EventTypeData } from './dto/response/eventTypes.response';
import { QueryFilterDto } from '@/common/dtos/queryFilter';

@Resolver()
export class EventTypeResolver {
  constructor(private service: EventTypeService) {}

  @Query(() => EventTypeData)
  async getEventTypes(
    @Args('input') input: QueryFilterDto,
  ): Promise<EventTypeData> {
    return this.service.getEventTypes(input);
  }

}
