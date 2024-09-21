import { QueryFilterDto } from '@/common/dtos/queryFilter';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class GetServicesRequest extends QueryFilterDto {
  @Field()
  startTime: Date;

  @Field()
  endTime: Date;
}
