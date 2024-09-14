import { InputType, Field, ID, PartialType } from '@nestjs/graphql';

@InputType()
export class CreateDeviceRequest {
  @Field()
  name: string;

  @Field()
  img: string;

  @Field()
  hourlyRentalFee: number;

  @Field()
  quantity: number;

  @Field()
  description: string;
}

@InputType()
export class UpdateDeviceRequest extends PartialType<CreateDeviceRequest>(
  CreateDeviceRequest,
) {
  @Field(() => ID)
  id: string;
}
