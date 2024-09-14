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

  @Field()
  description: string;

  @Field({ nullable: true })
  availableQuantity: number;

  @Field({ nullable: true })
  img: string;

  @Field()
  createdAt: Date;
}
