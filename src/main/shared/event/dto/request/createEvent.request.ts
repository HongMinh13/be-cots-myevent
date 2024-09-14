import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateEventRequest {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  detail: string;

  @Field({ nullable: true })
  img: string;

  @Field(() => ID)
  eventTypeId: string;

  @Field({ defaultValue: false, nullable: true })
  eventFormat: boolean;

  @Field({ defaultValue: false, nullable: true })
  isTemplate: boolean;

  @Field(() => ID)
  rentalId: string;
}
