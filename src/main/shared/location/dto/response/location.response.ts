import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export class LocationData {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  address: string;

  @Field()
  img: string;

  @Field()
  description: string;

  @Field()
  hourlyRentalFee: number;

  @Field()
  createdAt: Date;
}
