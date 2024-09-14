import { Repository } from 'typeorm';
import { Location } from '../entities/location.entity';
import { LocationRental } from '../entities/locationRental.entity';

export type LocationAttrs = Partial<
  Pick<Location, 'name' | 'address' | 'img' | 'hourlyRentalFee'>
>;

export class LocationRepository extends Repository<Location> {
  public baseGetLocationsAvailableQB(
    startTime: Date,
    endTime: Date,
    trx = this.manager,
  ) {
    const queryBuilder = trx
      .getRepository(Location)
      .createQueryBuilder('l')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('COALESCE(count(lr.locationId), 0)', 'count')
          .from(LocationRental, 'lr')
          .leftJoin('lr.rental', 'rental')
          .where('lr.locationId = l.id')
          .andWhere('rental.rental_start_time <= :startTime', { startTime })
          .andWhere('rental.rental_end_time >= :endTime', { endTime })
          .getQuery();
        return `(${subQuery}) = 0`;
      })
      .setParameter('startTime', startTime)
      .setParameter('endTime', endTime)
      .orderBy('l.id', 'ASC');

    return queryBuilder;
  }

  public async getExistingLocationsRented(
    locationIds: string[],
    startTime: Date,
    endTime: Date,
    trx = this.manager,
  ) {
    const queryBuilder = trx
      .getRepository(Location)
      .createQueryBuilder('l')
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('COALESCE(count(lr.locationId), 0)', 'count')
          .from(LocationRental, 'lr')
          .leftJoin('lr.rental', 'rental')
          .where('lr.locationId = l.id')
          .andWhere('rental.rental_start_time <= :startTime', { startTime })
          .andWhere('rental.rental_end_time >= :endTime', { endTime })
          .getQuery();
        return `(${subQuery}) > 0`;
      })
      .setParameter('startTime', startTime)
      .setParameter('endTime', endTime)
      .orderBy('l.id', 'ASC')
      .andWhere('l.id IN (:...locationIds)', { locationIds });

    return await queryBuilder.getMany();
  }

  public async getExistingLocationRented(
    locationId: string,
    startTime: Date,
    endTime: Date,
    trx = this.manager,
  ) {
    const queryBuilder = trx
      .getRepository(Location)
      .createQueryBuilder('l')
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('COALESCE(count(lr.locationId), 0)', 'count')
          .from(LocationRental, 'lr')
          .leftJoin('lr.rental', 'rental')
          .where('lr.locationId = l.id')
          .andWhere('rental.rental_start_time <= :startTime', { startTime })
          .andWhere('rental.rental_end_time >= :endTime', { endTime })
          .getQuery();
        return `(${subQuery}) > 0`;
      })
      .setParameter('startTime', startTime)
      .setParameter('endTime', endTime)
      .andWhere('l.id = :locationId', { locationId });

    return await queryBuilder.getOne();
  }

  public async getLocationsByIds(locationIds: string[], trx = this.manager) {
    return trx
      .createQueryBuilder(Location, 'l')
      .where('l.id IN (:...locationIds)', { locationIds })
      .getMany();
  }

  public async getLocationById(locationId: string, trx = this.manager) {
    return trx
      .createQueryBuilder(Location, 'l')
      .where('l.id = :locationId', { locationId })
      .getOne();
  }

  public async saveLocation(location: LocationAttrs, trx = this.manager) {
    return trx.getRepository(Location).save(location);
  }

  public getLocationsQb(trx = this.manager) {
    return trx.getRepository(Location).createQueryBuilder('l');
  }

  public async updateLocation(
    locationId: string,
    location: LocationAttrs,
    trx = this.manager,
  ) {
    return trx.getRepository(Location).update({ id: locationId }, location);
  }

  public async checkLocationInUse(locationId: string, trx = this.manager) {
    return await trx
      .getRepository(LocationRental)
      .createQueryBuilder('lr')
      .where('lr.locationId = :locationId', { locationId })
      .getCount();
  }

  public async deleteLocation(locationId: string, trx = this.manager) {
    return trx.getRepository(Location).delete({ id: locationId });
  }
}
