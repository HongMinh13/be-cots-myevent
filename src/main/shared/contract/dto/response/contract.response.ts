import { CONTRACT_STATUS } from '@/db/entities/contract.entity';
import { RentalData } from '@/main/shared/rental/dto/response/rental.response';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export class CustomerData {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  address: string;

  @Field()
  phoneNumber: string;
}

@ObjectType({ isAbstract: true })
export class ContractData {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  singingDate: Date;

  @Field(() => CONTRACT_STATUS, { nullable: true })
  status: CONTRACT_STATUS;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  rental: RentalData;

  @Field({ nullable: true })
  customer: CustomerData;
}
