import { RoleData } from '@/main/shared/user/dto/response/role.response';
import { Field, ID, ObjectType } from '@nestjs/graphql';

export interface SendCodeVerifyInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleId?: string;
}

@ObjectType({ isAbstract: true })
export class LoginResponse {
  @Field(() => ID)
  id: number;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  token: string;

  @Field()
  refreshToken: string;

  @Field()
  role: RoleData;
}

@ObjectType({ isAbstract: true })
export class RefreshResponse {
  @Field()
  accessToken: string;
}
