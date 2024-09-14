import { Field, ID, ObjectType } from '@nestjs/graphql';
import { RoleData } from './role.response';
import { UserStatus } from '@/db/entities/user.entity';

@ObjectType({ isAbstract: true })
export class UserData {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  avatar: string;

  @Field({ nullable: true })
  phoneNumber: string;

  @Field()
  lastName: string;

  @Field()
  firstName: string;

  @Field(() => ID)
  roleId: string;

  @Field()
  email: string;

  @Field(() => RoleData, { nullable: true })
  role: RoleData;

  @Field({ nullable: true })
  dob: Date;

  @Field({ nullable: true })
  gender: boolean;

  @Field({ nullable: true })
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt: Date;

  @Field(() => UserStatus, { nullable: true })
  status: UserStatus;
}
