import { CONTRACT_STATUS } from '@/db/entities/contract.entity';
import { Field, ID, InputType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';

@InputType()
export class ConfirmContractDeposit {
  @Field(() => ID)
  contractId: string;

  @Field(() => Boolean, { defaultValue: true })
  isApproved: boolean;
}

@InputType()
export class UpdateContractStatusDto {
  @Field(() => ID)
  contractId: string;

  @IsEnum(CONTRACT_STATUS)
  @Field(() => CONTRACT_STATUS)
  status: CONTRACT_STATUS;
}
