import { Field, ObjectType } from '@nestjs/graphql';
import { UserData } from './user.response';

@ObjectType({ isAbstract: true })
export class UserRentalData {
  @Field()
  id: string;

  @Field()
  user: UserData;
}
