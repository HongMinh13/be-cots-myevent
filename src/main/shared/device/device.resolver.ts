import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DeviceService } from './device.service';
import { ResponseMessageBase } from '@/common/interfaces/returnBase';
import {
  CreateDeviceRequest,
  UpdateDeviceRequest,
} from './dto/request/createDevice.request';
import { DevicesData } from './dto/response/devices.response';
import { GetServicesRequest } from '../../../common/dtos/getServices.request';
import { DeviceRentalData } from './dto/response/deviceRental.response';
import { QueryFilterDto } from '@/common/dtos/queryFilter';
import { DeviceData } from './dto/response/device.response';
import { Auth } from '@/decorators/auth.decorator';
import { ROLE } from '@/common/constant';
import { Roles } from '@/decorators/roles.decorator';

@Auth(['Roles'])
@Resolver()
export class DeviceResolver {
  constructor(private service: DeviceService) {}

  @Query(() => DevicesData)
  async getDevicesAvailable(
    @Args('input') input: GetServicesRequest,
  ): Promise<DevicesData> {
    return this.service.getDevicesAvailable(input);
  }

  @Query(() => [DeviceRentalData])
  async getDevicesRental(
    @Args('rentalId') rentalId: string,
  ): Promise<DeviceRentalData[]> {
    return this.service.getDevicesRental(rentalId);
  }

  @Query(() => DevicesData)
  async getDevices(@Args('input') input: QueryFilterDto): Promise<DevicesData> {
    return this.service.getDevices(input);
  }

  @Query(() => DeviceData)
  async getDeviceById(@Args('id') id: string): Promise<DeviceData> {
    return this.service.getDeviceById(id);
  }

  @Roles(ROLE.Admin)
  @Mutation(() => ResponseMessageBase)
  async createDevice(
    @Args('input') input: CreateDeviceRequest,
  ): Promise<ResponseMessageBase> {
    return this.service.createDevice(input);
  }

  @Roles(ROLE.Admin)
  @Mutation(() => ResponseMessageBase)
  async updateDevice(
    @Args('input') input: UpdateDeviceRequest,
  ): Promise<ResponseMessageBase> {
    return this.service.updateDevice(input);
  }

  @Roles(ROLE.Admin)
  @Mutation(() => ResponseMessageBase)
  async deleteDevice(@Args('id') id: string): Promise<ResponseMessageBase> {
    return this.service.deleteDevice(id);
  }
}
