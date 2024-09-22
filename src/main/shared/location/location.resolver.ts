import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LocationService } from './location.service';
import { ResponseMessageBase } from '@/common/interfaces/returnBase';
import {
  CreateLocationRequest,
  UpdateLocationRequest,
} from './dto/request/createLocation.request';
import { LocationsData } from './dto/response/locations.response';
import { GetServicesRequest } from '@/common/dtos/getServices.request';
import { LocationRentalData } from './dto/response/locationRental.response';
import { QueryFilterDto } from '@/common/dtos/queryFilter';
import { LocationData } from './dto/response/location.response';
import { ROLE } from '@/common/constant';
import { Auth } from '@/decorators/auth.decorator';
import { Roles } from '@/decorators/roles.decorator';

@Auth(['Roles'])
@Resolver()
export class LocationResolver {
  constructor(private service: LocationService) {}

  @Query(() => LocationsData)
  async getLocationsAvailable(
    @Args('input') input: GetServicesRequest,
  ): Promise<LocationsData> {
    return this.service.getLocationsAvailable(input);
  }

  @Query(() => [LocationRentalData])
  async getLocationsRental(
    @Args('rentalId') rentalId: string,
  ): Promise<LocationRentalData[]> {
    return this.service.getLocationsRental(rentalId);
  }

  @Query(() => LocationsData)
  async getLocations(
    @Args('input') input: QueryFilterDto,
  ): Promise<LocationsData> {
    return this.service.getLocations(input);
  }

  @Query(() => LocationData)
  async getLocationById(@Args('id') id: string): Promise<LocationData> {
    return this.service.getLocationById(id);
  }

  @Roles(ROLE.Admin)
  @Mutation(() => ResponseMessageBase)
  async createLocation(
    @Args('input') input: CreateLocationRequest,
  ): Promise<ResponseMessageBase> {
    return this.service.createLocation(input);
  }

  @Roles(ROLE.Admin)
  @Mutation(() => ResponseMessageBase)
  async updateLocation(
    @Args('input') input: UpdateLocationRequest,
  ): Promise<ResponseMessageBase> {
    return this.service.updateLocation(input);
  }

  @Roles(ROLE.Admin)
  @Mutation(() => ResponseMessageBase)
  async deleteLocation(@Args('id') id: string): Promise<ResponseMessageBase> {
    return this.service.deleteLocation(id);
  }
}
