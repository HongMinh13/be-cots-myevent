import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export class RoleData {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;
}
