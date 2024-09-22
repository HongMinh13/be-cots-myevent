import { PaginationInterface } from '@/common/interfaces/pagination';
import { ObjectType } from '@nestjs/graphql';
import { LocationData } from './location.response';

@ObjectType({ isAbstract: true })
export class LocationsData extends PaginationInterface<LocationData>(
  LocationData,
) {}
