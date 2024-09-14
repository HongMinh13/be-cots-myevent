import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateEventTypeRequest {
  @Field()
  name: string;
}
