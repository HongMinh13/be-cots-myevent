import { InputType, Field, ID, PartialType } from '@nestjs/graphql';

@InputType()
export class CreateLocationRequest {
  @Field()
  name: string;

  @Field()
  img: string;

  @Field()
  hourlyRentalFee: number;

  @Field()
  address: string;

  @Field()
  description: string;
}

@InputType()
export class UpdateLocationRequest extends PartialType<CreateLocationRequest>(
  CreateLocationRequest,
) {
  @Field(() => ID)
  id: string;
}
