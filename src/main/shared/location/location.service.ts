import { Injectable } from '@nestjs/common';
import {
  CreateLocationRequest,
  UpdateLocationRequest,
} from './dto/request/createLocation.request';
import { ResponseMessageBase } from '@/common/interfaces/returnBase';
import { getManager } from 'typeorm';
import { getPaginationResponse } from '@/common/base/getPaginationResponse';
import { GetServicesRequest } from '@/common/dtos/getServices.request';
import { LocationsData } from './dto/response/locations.response';
import { LocationRepository } from '@/db/repositories/location.repository';
import { LocationRentalRepository } from '@/db/repositories/locationRental.repository';
import { QueryFilterDto } from '@/common/dtos/queryFilter';

@Injectable()
export class LocationService {
  constructor(
    private readonly locationRepository: LocationRepository,
    private readonly locationRentalRepository: LocationRentalRepository,
  ) {}

  async createLocation(
    input: CreateLocationRequest,
  ): Promise<ResponseMessageBase> {
    const trx = getManager();
    await this.locationRepository.saveLocation(input, trx);

    return { message: 'Tạo mới địa điểm thành công', success: true };
  }

  async getLocationsAvailable(
    input: GetServicesRequest,
  ): Promise<LocationsData> {
    const { startTime, endTime } = input;

    const trx = getManager();
    const queryBuilder = this.locationRepository.baseGetLocationsAvailableQB(
      startTime,
      endTime,
      trx,
    );

    const locations = await getPaginationResponse(queryBuilder, input);

    return locations;
  }

  async getLocationsRental(rentalId: string) {
    const trx = getManager();
    const locationsRental =
      await this.locationRentalRepository.getLocationsRentalByRentalId(
        rentalId,
        trx,
      );

    return locationsRental.map((locationRental) => {
      return {
        id: locationRental.id,
        location: locationRental.location,
      };
    });
  }

  async getLocations(input: QueryFilterDto) {
    const trx = getManager();
    const queryBuilder = this.locationRepository.getLocationsQb(trx);

    const locations = await getPaginationResponse(queryBuilder, input);

    return locations;
  }

  async updateLocation(input: UpdateLocationRequest) {
    const { id, ...locationData } = input;

    const trx = getManager();
    await this.locationRepository.updateLocation(id, locationData, trx);

    return { message: 'Cập nhật địa điểm thành công', success: true };
  }

  async getLocationById(id: string) {
    return getManager().transaction(async (trx) => {
      const location = await this.locationRepository.getLocationById(id, trx);

      return location;
    });
  }

  async deleteLocation(id: string) {
    const trx = getManager();
    const location = await this.locationRepository.getLocationById(id, trx);

    if (!location) {
      return {
        message: 'Không tìm thấy địa điểm',
        success: false,
      };
    }

    const locationInUse = await this.locationRepository.checkLocationInUse(
      id,
      trx,
    );

    if (locationInUse) {
      return {
        message: 'Địa điểm đang được sử dụng, không thể xóa',
        success: false,
      };
    }

    await this.locationRepository.deleteLocation(id, trx);

    return { message: 'Xóa địa điểm thành công', success: true };
  }
}
