import { Field, ObjectType } from '@nestjs/graphql';
import { DeviceData } from './device.response';

@ObjectType({ isAbstract: true })
export class DeviceRentalData {
  @Field()
  id: string;

  @Field()
  quantity: number;

  @Field(() => DeviceData)
  device: DeviceData;
}
