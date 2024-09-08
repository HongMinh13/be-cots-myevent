import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export class DeviceData {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  img: string;

  @Field()
  hourlyRentalFee: number;

  @Field()
  quantity: number;

  @Field({ nullable: true })
  availableQuantity: number;
}
