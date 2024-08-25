import { Field, ID, ObjectType } from '@nestjs/graphql';
import { RoleData } from './role.response';

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
  password: string;

  @Field()
  email: string;

  @Field(() => RoleData)
  role: RoleData;

  @Field()
  dob: Date;

  @Field()
  gender: boolean;

  @Field()
  hourlySalary: number;

  @Field({ nullable: true })
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt: Date;
}
