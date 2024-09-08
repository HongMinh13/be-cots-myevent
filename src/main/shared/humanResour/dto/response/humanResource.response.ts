import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export class HumanResourceData {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  hourlySalary: number;

  @Field()
  quantity: number;

  @Field({ nullable: true })
  availableQuantity: number;
}
