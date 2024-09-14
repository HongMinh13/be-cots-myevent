import { Field, ID, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

@InputType()
export class CreateServiceRentalRequest {
  @Field(() => ID)
  id: string;

  @Field()
  quantity: number;
}

@InputType()
export class orgTimeRequest {
  @Field()
  startTime: Date;

  @Field()
  endTime: Date;
}

@InputType()
export class UpsertTimelineRequest {
  @IsOptional()
  @Field({ nullable: true })
  id?: string;

  @Field()
  timeStart: Date;

  @Field()
  description: string;
}

@InputType()
export class CreateContractDetailsRequest {
  @Field()
  contractName: string;

  @Field(() => orgTimeRequest)
  orgTime: orgTimeRequest;

  @Field()
  customerName: string;

  @Field()
  phoneNumber: string;

  @Field()
  customerAddress: string;

  @Field()
  useCompanyLocation: boolean;

  @Field({ nullable: true })
  selectedLocation: string;

  @Field({ nullable: true })
  customLocation: string;
}

@InputType()
export class RentalServicesRequest {
  @Field(() => ID, { nullable: true })
  eventId: string;

  @Field(() => CreateContractDetailsRequest)
  contractDetails: CreateContractDetailsRequest;

  @Field(() => [CreateServiceRentalRequest], { nullable: true })
  @Type(() => CreateServiceRentalRequest)
  @ValidateNested({ each: true })
  employees: CreateServiceRentalRequest[];

  @Field(() => [CreateServiceRentalRequest], { nullable: true })
  @Type(() => CreateServiceRentalRequest)
  @ValidateNested({ each: true })
  devices: CreateServiceRentalRequest[];

  @Field(() => [UpsertTimelineRequest], { nullable: true })
  @Type(() => UpsertTimelineRequest)
  @ValidateNested({ each: true })
  timeline: UpsertTimelineRequest[];
}
