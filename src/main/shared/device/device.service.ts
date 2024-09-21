import { Injectable } from '@nestjs/common';
import {
  CreateDeviceRequest,
  UpdateDeviceRequest,
} from './dto/request/createDevice.request';
import { getManager } from 'typeorm';
import { ResponseMessageBase } from '@/common/interfaces/returnBase';
import { DevicesData } from './dto/response/devices.response';
import { getPaginationResponse } from '@/common/base/getPaginationResponse';
import { GetServicesRequest } from '../../../common/dtos/getServices.request';
import { DeviceRepository } from '@/db/repositories/device.repository';
import { DeviceRentalData } from './dto/response/deviceRental.response';
import { DeviceRentalRepository } from '@/db/repositories/deviceRental.repository';
import { QueryFilterDto } from '@/common/dtos/queryFilter';

@Injectable()
export class DeviceService {
  constructor(
    private readonly deviceRepository: DeviceRepository,
    private readonly deviceRentalRepository: DeviceRentalRepository,
  ) {}

  async createDevice(input: CreateDeviceRequest): Promise<ResponseMessageBase> {
    const trx = getManager();
    await this.deviceRepository.saveDevice(input, trx);

    return { message: 'Tạo thiết bị thành công', success: true };
  }

  async getDevicesAvailable(input: GetServicesRequest): Promise<DevicesData> {
    const { startTime, endTime } = input;

    const trx = getManager();
    const queryBuilder = this.deviceRepository.baseGetDevicesAvailableQB(
      startTime,
      endTime,
      trx,
    );

    const devices = await getPaginationResponse(queryBuilder, input);

    return devices;
  }

  async getDevicesRental(rentalId: string): Promise<DeviceRentalData[]> {
    const trx = getManager();
    const devicesRental =
      await this.deviceRentalRepository.getDevicesRentalByRentalId(
        rentalId,
        trx,
      );

    return devicesRental.map((deviceRental) => {
      return {
        id: deviceRental.id,
        quantity: deviceRental.quantity,
        device: deviceRental.device,
      };
    });
  }

  async getDevices(input: QueryFilterDto): Promise<DevicesData> {
    const trx = getManager();
    const queryBuilder = this.deviceRepository.getDevicesQb(trx);

    const devices = await getPaginationResponse(queryBuilder, input);

    return devices;
  }

  async updateDevice(input: UpdateDeviceRequest): Promise<ResponseMessageBase> {
    const { id, ...deviceData } = input;

    const trx = getManager();
    await this.deviceRepository.updateDevice(id, deviceData, trx);

    return { message: 'Cập nhật thiết bị thành công', success: true };
  }

  async getDeviceById(id: string) {
    const trx = getManager();
    const device = await this.deviceRepository.getDeviceById(id, trx);

    return device;
  }

  async deleteDevice(id: string): Promise<ResponseMessageBase> {
    const trx = getManager();

    const device = await this.deviceRepository.getDeviceById(id, trx);

    if (!device) {
      return { message: 'Không tìm thấy thiết bị', success: false };
    }

    const isDeviceRented = await this.deviceRepository.checkDeviceInUse(
      id,
      trx,
    );

    if (isDeviceRented) {
      return {
        message: 'Thiết bị này đang được sử dụng và không thể xóa',
        success: false,
      };
    }

    await this.deviceRepository.deleteDevice(id, trx);

    return { message: 'Xóa thiết bị thành công', success: true };
  }
}
