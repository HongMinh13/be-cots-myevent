import { Repository } from 'typeorm';
import { DeviceRental } from '../entities/deviceRental.entity';

export type DeviceRentalAttrs = Partial<
  Pick<DeviceRental, 'deviceId' | 'rentalId' | 'quantity' | 'id'>
>;

export class DeviceRentalRepository extends Repository<DeviceRental> {
  public async saveDeviceRentals(
    deviceRentals: DeviceRentalAttrs[],
    trx = this.manager,
  ): Promise<void> {
    await trx.save(DeviceRental, deviceRentals);
  }

  public async deleteDeviceRentals(
    deviceRentals: DeviceRentalAttrs[],
    trx = this.manager,
  ): Promise<void> {
    await trx.delete(DeviceRental, deviceRentals);
  }

  public async getDevicesRentalByRentalId(
    rentalId: string,
    trx = this.manager,
  ): Promise<DeviceRental[]> {
    return trx
      .createQueryBuilder(DeviceRental, 'dr')
      .innerJoinAndSelect('dr.device', 'device')
      .where('dr.rentalId = :rentalId', { rentalId })
      .getMany();
  }
}
