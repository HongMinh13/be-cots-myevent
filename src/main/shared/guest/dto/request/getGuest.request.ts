import { QueryFilterDto } from '@/common/dtos/queryFilter';
import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class GetGuestRequest extends QueryFilterDto {
  @Field(() => ID)
  emailSendLogId: string;
}
