import { CreateEventTypeRequest } from '@/main/shared/eventType/dto/request/createEventType.request';
import {
  CreateServiceRentalRequest,
  UpsertTimelineRequest,
} from '@/main/shared/rental/dto/request/rentalServices.request';
import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

@InputType()
export class CreateEventTemplateRequest {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  detail: string;

  @Field({ nullable: true })
  img: string;

  @Field(() => CreateEventTypeRequest, { nullable: true })
  eventType: CreateEventTypeRequest;

  @Field({ nullable: true })
  eventTypeId: string;

  @Field({ defaultValue: false, nullable: true })
  eventFormat: boolean;

  @Field(() => [CreateServiceRentalRequest], { nullable: true })
  @Type(() => CreateServiceRentalRequest)
  @ValidateNested({ each: true })
  humanResources: CreateServiceRentalRequest[];

  @Field(() => [CreateServiceRentalRequest], { nullable: true })
  @Type(() => CreateServiceRentalRequest)
  @ValidateNested({ each: true })
  devices: CreateServiceRentalRequest[];

  @Field(() => [UpsertTimelineRequest], { nullable: true })
  @Type(() => UpsertTimelineRequest)
  @ValidateNested({ each: true })
  timeline: UpsertTimelineRequest[];
}

@InputType()
export class UpdateEventTemplateRequest extends PartialType<CreateEventTemplateRequest>(
  CreateEventTemplateRequest,
) {
  @Field(() => ID)
  id: string;
}
