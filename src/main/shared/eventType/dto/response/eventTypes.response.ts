import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export class EventTypeData {
  @Field()
  id: string;

  @Field()
  name: string;
}
