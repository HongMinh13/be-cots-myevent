import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateServiceRentalRequest,
  RentalServicesRequest,
} from './dto/request/rentalServices.request';
import { EntityManager, getManager } from 'typeorm';
import { Context } from '@/decorators/user.decorator';
import { ResponseMessageBase } from '@/common/interfaces/returnBase';
import { DeviceRepository } from '@/db/repositories/device.repository';
import { DeviceRentalRepository } from '@/db/repositories/deviceRental.repository';
import { LocationRentalRepository } from '@/db/repositories/locationRental.repository';
import { LocationRepository } from '@/db/repositories/location.repository';
import { RentalRepository } from '@/db/repositories/rental.repository';
import { messageKey } from '@/i18n';
import { HumanResourcesRepository } from '@/db/repositories/humanResources.repository';
import { HumanResourcesRentalRepository } from '@/db/repositories/humanResourceRental.repository';
import { ContractRepository } from '@/db/repositories/contract.repository';
import { CustomerRepository } from '@/db/repositories/customer.repository';
import { TimelineRepository } from '@/db/repositories/timeline.repository';

@Injectable()
export class RentalService {
  constructor(
    private readonly deviceRepository: DeviceRepository,
    private readonly deviceRentalRepository: DeviceRentalRepository,
    private readonly locationRentalRepository: LocationRentalRepository,
    private readonly locationRepository: LocationRepository,
    private readonly rentalRepository: RentalRepository,
    private readonly humanResourcesRepository: HumanResourcesRepository,
    private readonly humanResourcesRentalRepository: HumanResourcesRentalRepository,
    private readonly contractRepository: ContractRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly timelineRepository: TimelineRepository,
  ) {}

  public async saveDeviceRentals(params: {
    deviceRentals: CreateServiceRentalRequest[];
    rentalStartTime: Date;
    rentalEndTime: Date;
    rentalId: string;
    initialTotalPrice: number;
    totalDays: number;
    trx: EntityManager;
  }): Promise<number> {
    const {
      deviceRentals,
      rentalStartTime,
      rentalEndTime,
      rentalId,
      initialTotalPrice,
      totalDays,
      trx,
    } = params;

    const deviceIds = deviceRentals.map((deviceRental) => deviceRental.id);
    const existingDevicesRented =
      await this.deviceRepository.getExistingDevicesRented(
        deviceRentals,
        rentalStartTime,
        rentalEndTime,
        trx,
      );

    if (existingDevicesRented.length) {
      throw new BadRequestException(messageKey.RENTAL.DEVICE_ALREADY_RENTED);
    }

    const devices = await this.deviceRepository.getDevicesByIds(deviceIds, trx);

    const totalPrice = devices.reduce(
      (acc, device) =>
        acc +
        deviceRentals.find((deviceRental) => deviceRental.id === device.id)
          .quantity *
          device.hourlyRentalFee *
          totalDays,
      initialTotalPrice,
    );

    const deviceRentalsData = deviceRentals.map((deviceRental) => ({
      deviceId: deviceRental.id,
      rentalId: rentalId,
      quantity: deviceRental.quantity,
    }));

    await this.deviceRentalRepository.saveDeviceRentals(deviceRentalsData, trx);

    return totalPrice;
  }

  public async saveHumanResourcesRentals(params: {
    employees: CreateServiceRentalRequest[];
    rentalStartTime: Date;
    rentalEndTime: Date;
    rentalId: string;
    initialTotalPrice: number;
    totalDays: number;
    trx: EntityManager;
  }): Promise<number> {
    const {
      employees,
      rentalStartTime,
      rentalEndTime,
      rentalId,
      initialTotalPrice,
      totalDays,
      trx,
    } = params;

    const humanResourcesIds = employees.map(
      (humanResourcesRental) => humanResourcesRental.id,
    );
    const existingHumanResourcesRented =
      await this.humanResourcesRepository.getExistingHumanResourcesRented(
        employees,
        rentalStartTime,
        rentalEndTime,
        trx,
      );
    if (existingHumanResourcesRented.length) {
      throw new BadRequestException(messageKey.RENTAL.EMPLOYEE_ALREADY_RENTED);
    }

    const humanResources =
      await this.humanResourcesRepository.getHumanResourcesByIds(
        humanResourcesIds,
        trx,
      );

    const totalPrice = humanResources.reduce(
      (acc, data) =>
        acc +
        data.hourlySalary *
          totalDays *
          employees.find((employee) => employee.id === data.id).quantity,
      initialTotalPrice,
    );

    const employeesData = employees.map((employee) => ({
      humanResourcesId: employee.id,
      rentalId: rentalId,
      quantity: employee.quantity,
    }));

    await this.humanResourcesRentalRepository.saveHumanResourcesRentals(
      employeesData,
      trx,
    );

    return totalPrice;
  }

  public async saveLocationRental(params: {
    locationId: string;
    rentalStartTime: Date;
    rentalEndTime: Date;
    rentalId: string;
    initialTotalPrice: number;
    totalDays: number;
    trx: EntityManager;
  }): Promise<number> {
    const {
      locationId,
      rentalStartTime,
      rentalEndTime,
      rentalId,
      initialTotalPrice,
      totalDays,
      trx,
    } = params;

    const existingLocationRented =
      await this.locationRepository.getExistingLocationRented(
        locationId,
        rentalStartTime,
        rentalEndTime,
        trx,
      );

    if (existingLocationRented) {
      throw new BadRequestException(messageKey.RENTAL.LOCATION_ALREADY_RENTED);
    }

    const location = await this.locationRepository.getLocationById(
      locationId,
      trx,
    );

    const totalPrice = location.hourlyRentalFee * totalDays + initialTotalPrice;

    const locationRentalData = {
      locationId,
      rentalId,
    };

    await this.locationRentalRepository.saveLocationRental(
      locationRentalData,
      trx,
    );

    return totalPrice;
  }

  public async rentalServices(
    input: RentalServicesRequest,
    ctx: Context,
  ): Promise<ResponseMessageBase> {
    const { employees, devices, contractDetails, eventId, timeline } = input;

    return await getManager().transaction(async (trx) => {
      const customer = await this.customerRepository.saveCustomer(
        {
          name: contractDetails.customerName,
          phoneNumber: contractDetails.phoneNumber,
          address: contractDetails.customerAddress,
        },
        trx,
      );

      const rentalDetail = {
        rentalStartTime: contractDetails.orgTime.startTime,
        rentalEndTime: contractDetails.orgTime.endTime,
        userId: ctx.currentUser.id,
        customLocation: contractDetails.customLocation,
        eventId,
      };

      let totalPrice = 0;
      const totalDays = Math.ceil(
        (contractDetails.orgTime.endTime.getTime() -
          contractDetails.orgTime.startTime.getTime()) /
          (1000 * 60 * 60 * 24),
      );

      const rental = await this.rentalRepository.saveRental(rentalDetail, trx);

      if (employees && employees.length) {
        totalPrice = await this.saveHumanResourcesRentals({
          employees,
          rentalStartTime: contractDetails.orgTime.startTime,
          rentalEndTime: contractDetails.orgTime.endTime,
          rentalId: rental.id,
          initialTotalPrice: totalPrice,
          totalDays,
          trx,
        });
      }

      if (devices && devices.length) {
        totalPrice = await this.saveDeviceRentals({
          deviceRentals: devices,
          rentalStartTime: contractDetails.orgTime.startTime,
          rentalEndTime: contractDetails.orgTime.endTime,
          rentalId: rental.id,
          initialTotalPrice: totalPrice,
          totalDays,
          trx,
        });
      }

      if (
        contractDetails.useCompanyLocation &&
        contractDetails.selectedLocation
      ) {
        totalPrice = await this.saveLocationRental({
          locationId: contractDetails.selectedLocation,
          rentalStartTime: contractDetails.orgTime.startTime,
          rentalEndTime: contractDetails.orgTime.endTime,
          rentalId: rental.id,
          initialTotalPrice: totalPrice,
          totalDays,
          trx,
        });
      }

      await this.rentalRepository.updateRental(rental.id, { totalPrice }, trx);

      await this.contractRepository.saveContract(
        {
          name: contractDetails.contractName,
          rentalId: rental.id,
          signingDate: null,
          customerId: customer.id,
        },
        trx,
      );

      timeline?.length &&
        (await this.timelineRepository.saveTimelines(
          timeline?.map((data) => ({
            ...data,
            rentalId: rental.id,
          })),
          trx,
        ));

      return { message: 'Tạo mới hợp đồng thành công', success: true };
    });
  }
}
