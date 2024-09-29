import { QueryFilterDto } from '@/common/dtos/queryFilter';
import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class GetEmailSendLogRequest extends QueryFilterDto {
  @Field(() => ID)
  contractId: string;
}
