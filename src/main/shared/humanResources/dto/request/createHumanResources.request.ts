import { InputType, Field, ID, PartialType } from '@nestjs/graphql';

@InputType()
export class CreateHumanResourcesRequest {
  @Field()
  name: string;

  @Field()
  hourlySalary: number;

  @Field()
  quantity: number;

  @Field()
  description: string;

  @Field()
  img: string;
}

@InputType()
export class UpdateHumanResourcesRequest extends PartialType<CreateHumanResourcesRequest>(
  CreateHumanResourcesRequest,
) {
  @Field(() => ID)
  id: string;
}
