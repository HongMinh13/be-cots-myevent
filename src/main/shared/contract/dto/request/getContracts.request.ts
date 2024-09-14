import { QueryFilterDto } from '@/common/dtos/queryFilter';
import { CONTRACT_STATUS } from '@/db/entities/contract.entity';
import { Field, InputType } from '@nestjs/graphql';

@InputType({ isAbstract: true })
export class GetContractsRequest extends QueryFilterDto {
  @Field(() => CONTRACT_STATUS, { nullable: true })
  status?: CONTRACT_STATUS;

  @Field({ nullable: true })
  startTime?: Date;

  @Field({ nullable: true })
  endTime?: Date;

  @Field({ nullable: true })
  name?: string;
}
