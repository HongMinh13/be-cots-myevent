import { EventData } from '@/main/shared/event/dto/response/event.response';
import { DeviceData } from '@/main/shared/device/dto/response/device.response';
import { HumanResourceData } from '@/main/shared/humanResources/dto/response/humanResource.response';
import { LocationData } from '@/main/shared/location/dto/response/location.response';
import { UserData } from '@/main/shared/user/dto/response/user.response';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export class TimelineData {
  @Field()
  id: string;

  @Field()
  startTime: Date;

  @Field()
  description: string;
}

@ObjectType({ isAbstract: true })
export class RentalData {
  @Field()
  id: string;

  @Field(() => UserData)
  user: UserData;

  @Field()
  totalPrice: number;

  @Field({ nullable: true })
  rentalStartTime: Date;

  @Field({ nullable: true })
  rentalEndTime: Date;

  @Field({ nullable: true })
  customLocation: string;

  @Field(() => [DeviceData], { nullable: true })
  devices: DeviceData[];

  @Field(() => [LocationData], { nullable: true })
  locations: LocationData[];

  @Field(() => [HumanResourceData], { nullable: true })
  humanResources: HumanResourceData[];

  @Field(() => EventData, { nullable: true })
  event: EventData | null;

  @Field(() => [TimelineData], { nullable: true })
  timelines: TimelineData[];
}
