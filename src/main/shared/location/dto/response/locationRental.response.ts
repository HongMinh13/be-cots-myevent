import { Field, ObjectType } from '@nestjs/graphql';
import { LocationData } from './location.response';

@ObjectType({ isAbstract: true })
export class LocationRentalData {
  @Field()
  id: string;

  @Field(() => LocationData)
  location: LocationData;
}
