import { QueryFilterDto } from '@/common/dtos/queryFilter';
import { UserStatus } from '@/db/entities/user.entity';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetUsersRequest extends QueryFilterDto {
  @Field({ nullable: true })
  search?: string;

  @Field(() => UserStatus, { nullable: true })
  status?: UserStatus;

  @Field({ nullable: true })
  role?: string;
}
