import { Repository } from 'typeorm';
import { HumanResourcesRental } from '../entities/humanResourcesRental.entity';

export type HumanResourcesRentalAttrs = Partial<
  Pick<
    HumanResourcesRental,
    'humanResourcesId' | 'rentalId' | 'quantity' | 'id'
  >
>;

export class HumanResourcesRentalRepository extends Repository<HumanResourcesRental> {
  public async saveHumanResourcesRentals(
    humanResourcesRentals: HumanResourcesRentalAttrs[],
    trx = this.manager,
  ): Promise<void> {
    await trx.save(HumanResourcesRental, humanResourcesRentals);
  }

  public async deleteHumanResourcesRentals(
    humanResourcesRentals: HumanResourcesRentalAttrs[],
    trx = this.manager,
  ): Promise<void> {
    await trx.delete(HumanResourcesRental, humanResourcesRentals);
  }

  public async getHumanResourcesRentalByRentalId(
    rentalId: string,
    trx = this.manager,
  ): Promise<HumanResourcesRental[]> {
    return trx
      .createQueryBuilder(HumanResourcesRental, 'dr')
      .innerJoinAndSelect('dr.humanResources', 'humanResources')
      .where('dr.rentalId = :rentalId', { rentalId })
      .getMany();
  }
}
