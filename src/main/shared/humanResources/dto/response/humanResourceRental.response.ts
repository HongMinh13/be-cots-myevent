import { Field, ObjectType } from '@nestjs/graphql';
import { HumanResourceData } from './humanResource.response';

@ObjectType({ isAbstract: true })
export class HumanResourceRentalData {
  @Field()
  id: string;

  @Field()
  quantity: number;

  @Field(() => HumanResourceData)
  humanResource: HumanResourceData;
}
