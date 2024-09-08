import { DeviceData } from '@/main/shared/device/dto/response/device.response';
import { HumanResourceData } from '@/main/shared/humanResour/dto/response/humanResource.response';
import { LocationData } from '@/main/shared/location/dto/response/location.response';
import { UserData } from '@/main/shared/user/dto/response/user.response';
import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

@ObjectType({ isAbstract: true })
export class RentalData {
  @Field()
  id: string;

  @Field(() => UserData)
  user: UserData;

  @Field()
  totalPrice: number;

  @Field()
  rentalStartTime: Date;

  @Field()
  rentalEndTime: Date;

  @Type(() => DeviceData)
  @ValidateNested({ each: true })
  @Field(() => [DeviceData], { nullable: true })
  devices: DeviceData[];

  @Type(() => LocationData)
  @ValidateNested({ each: true })
  @Field(() => [LocationData], { nullable: true })
  locations: LocationData[];

  @Type(() => HumanResourceData)
  @ValidateNested({ each: true })
  @Field(() => [HumanResourceData], { nullable: true })
  humanResources: HumanResourceData[];
}
