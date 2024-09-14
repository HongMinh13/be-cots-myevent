import {
  Brackets,
  EntityManager,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { Device } from '../entities/device.entity';
import { DeviceRentalAttrs } from './deviceRental.repository';
import { DeviceRental } from '../entities/deviceRental.entity';

export type DeviceAttrs = Partial<
  Pick<Device, 'name' | 'quantity' | 'img' | 'hourlyRentalFee'>
>;

export class DeviceRepository extends Repository<Device> {
  public baseGetDevicesAvailableQB(
    startTime: Date,
    endTime: Date,
    trx: EntityManager = this.manager,
  ): SelectQueryBuilder<Device> {
    const queryBuilder = trx
      .createQueryBuilder(Device, 'device')
      .leftJoin(
        (qb) =>
          qb
            .subQuery()
            .select('COALESCE(SUM(dr.quantity), 0)', 'total')
            .addSelect('dr.device_id', 'device_id')
            .from('device_rental', 'dr')
            .leftJoin('rental', 'rental', 'dr.rental_id = rental.id')
            .where('rental.rental_start_time <= :startTime', { startTime })
            .andWhere('rental.rental_end_time >= :endTime', { endTime })
            .groupBy('dr.device_id'),
        'device_rented',
        'device.id = device_rented.device_id',
      )
      .addSelect(
        'device.quantity - COALESCE(device_rented.total, 0)',
        'device_available_quantity',
      )
      .andWhere('device.quantity - COALESCE(device_rented.total, 0) > 0')
      .setParameters({ startTime, endTime })
      .orderBy('device.id', 'ASC');

    return queryBuilder;
  }

  public async getExistingDevicesRented(
    deviceRentals: DeviceRentalAttrs[],
    startTime: Date,
    endTime: Date,
    trx: EntityManager = this.manager,
  ): Promise<Device[]> {
    const deviceRentalQuantities = deviceRentals.reduce((acc, dr) => {
      acc[dr.deviceId] = dr.quantity;
      return acc;
    }, {} as Record<number, number>);

    const existingDevicesRented = [];

    for (const deviceRental of deviceRentals) {
      const queryBuilder = trx
        .createQueryBuilder(Device, 'device')
        .where('device.id = :deviceId', { deviceId: deviceRental.deviceId })
        .andWhere((qb) => {
          const subQuery = qb
            .subQuery()
            .select('COALESCE(SUM(dr.quantity), 0)', 'total')
            .from('device_rental', 'dr')
            .leftJoin('rental', 'rental', 'dr.rental_id = rental.id')
            .where('dr.device_id = device.id')
            .andWhere(
              new Brackets((qb) => {
                qb.where(
                  new Brackets((qb) => {
                    qb.where('rental.rental_start_time <= :startTime', {
                      startTime,
                    }).andWhere('rental.rental_end_time >= :startTime', {
                      startTime,
                    });
                  }),
                ).orWhere(
                  new Brackets((qb) => {
                    qb.where('rental.rental_start_time <= :endTime', {
                      endTime,
                    }).andWhere('rental.rental_end_time >= :endTime', {
                      endTime,
                    });
                  }),
                );
              }),
            )
            .getQuery();
          return `device.quantity - (${subQuery}) < ${
            deviceRentalQuantities[deviceRental.deviceId]
          }`;
        })
        .setParameter('startTime', startTime)
        .setParameter('endTime', endTime)
        .orderBy('device.id', 'ASC');

      const device = await queryBuilder.getOne();

      if (device) {
        existingDevicesRented.push(device);
      }
    }

    return existingDevicesRented;
  }

  public async getDevicesByIds(
    deviceIds: string[],
    trx: EntityManager = this.manager,
  ): Promise<Device[]> {
    return trx
      .createQueryBuilder(Device, 'device')
      .where('device.id IN (:...deviceIds)', { deviceIds })
      .getMany();
  }

  public getDevicesQb(
    trx: EntityManager = this.manager,
  ): SelectQueryBuilder<Device> {
    return trx.createQueryBuilder(Device, 'device');
  }

  public async saveDevice(
    device: DeviceAttrs,
    trx: EntityManager = this.manager,
  ): Promise<void> {
    await trx.getRepository(Device).save(device);
  }

  public async updateDevice(
    id: string,
    device: DeviceAttrs,
    trx: EntityManager = this.manager,
  ): Promise<void> {
    await trx.getRepository(Device).update(id, device);
  }

  public getDeviceById(id: string, trx: EntityManager = this.manager) {
    return trx.getRepository(Device).findOne(id);
  }

  public async checkDeviceInUse(
    deviceId: string,
    trx: EntityManager = this.manager,
  ) {
    return await trx
      .createQueryBuilder(DeviceRental, 'dr')
      .where('dr.device_id = :deviceId', { deviceId })
      .getCount();
  }

  public async deleteDevice(id: string, trx: EntityManager = this.manager) {
    await trx.getRepository(Device).delete(id);
  }
}
