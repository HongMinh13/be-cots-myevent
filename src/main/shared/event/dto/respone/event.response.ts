import { EventTypeData } from '@/main/shared/eventType/dto/response/eventTypes.response';
import { RentalData } from '@/main/shared/rental/dto/response/rental.response';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export class EventData {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  img: string;

  @Field(() => EventTypeData, { nullable: true })
  eventType: EventTypeData;

  @Field()
  eventFormat: boolean;

  @Field()
  isTemplate: boolean;

  @Field(() => RentalData, { nullable: true })
  rental: RentalData;

  @Field()
  createdAt: Date;
}
