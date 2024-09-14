import { Repository } from 'typeorm';
import { Rental } from '../entities/rental.entity';

export type RentalAttrs = Partial<
  Pick<
    Rental,
    'rentalStartTime' | 'rentalEndTime' | 'userId' | 'totalPrice' | 'eventId'
  >
>;

export class RentalRepository extends Repository<Rental> {
  public async saveRental(
    rental: RentalAttrs,
    trx = this.manager,
  ): Promise<Rental> {
    return await trx.save(Rental, rental);
  }

  public async updateRental(
    rentalId: string,
    rental: RentalAttrs,
    trx = this.manager,
  ): Promise<Rental> {
    await trx.update(Rental, rentalId, rental);
    return trx.findOneOrFail(Rental, rentalId);
  }

  public async deleteRental(
    rentalId: string,
    trx = this.manager,
  ): Promise<void> {
    await trx.delete(Rental, rentalId);
  }
}
