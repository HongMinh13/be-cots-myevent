import { Repository } from 'typeorm';
import { LocationRental } from '../entities/locationRental.entity';

export type LocationRentalAttrs = Pick<
  LocationRental,
  'locationId' | 'rentalId'
>;

export class LocationRentalRepository extends Repository<LocationRental> {
  public async saveLocationRentals(
    locationRentals: LocationRentalAttrs[],
    trx = this.manager,
  ): Promise<void> {
    await trx.save(LocationRental, locationRentals);
  }

  public async saveLocationRental(
    locationRental: LocationRentalAttrs,
    trx = this.manager,
  ): Promise<void> {
    await trx.save(LocationRental, locationRental);
  }

  public async getLocationsRentalByRentalId(
    rentalId: string,
    trx = this.manager,
  ): Promise<LocationRental[]> {
    return trx
      .createQueryBuilder(LocationRental, 'lr')
      .innerJoinAndSelect('lr.location', 'location')
      .where('lr.rentalId = :rentalId', { rentalId })
      .getMany();
  }
}
