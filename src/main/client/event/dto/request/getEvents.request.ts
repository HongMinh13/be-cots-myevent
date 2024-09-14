import { QueryFilterDto } from '@/common/dtos/queryFilter';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetEventsRequest extends QueryFilterDto {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  eventTypeId?: string;
}
