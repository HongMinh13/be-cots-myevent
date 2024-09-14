import { Repository, SelectQueryBuilder } from 'typeorm';
import { Contract } from '../entities/contract.entity';
import { GetContractsRequest } from '@/main/shared/contract/dto/request/getContracts.request';
import _ from 'lodash';

export type ContractAttrs = Partial<
  Pick<Contract, 'name' | 'rentalId' | 'signingDate' | 'status' | 'customerId'>
>;

export class ContractRepository extends Repository<Contract> {
  public async saveContract(
    contract: ContractAttrs,
    trx = this.manager,
  ): Promise<Contract> {
    return await trx.save(Contract, contract);
  }

  public async updateContract(
    contractId: string,
    contract: ContractAttrs,
    trx = this.manager,
  ): Promise<Contract> {
    await trx.update(Contract, contractId, contract);
    return trx.findOneOrFail(Contract, contractId);
  }

  public async getContractByRentalId(
    rentalId: string,
    trx = this.manager,
  ): Promise<Contract> {
    return trx
      .createQueryBuilder(Contract, 'contract')
      .leftJoinAndSelect('contract.rental', 'rental')
      .leftJoinAndSelect('rental.user', 'user')
      .where('contract.rentalId = :rentalId', { rentalId })
      .getOne();
  }

  public getMyContractsQb(userId: string, trx = this.manager) {
    return this.getContractsQbOrderByTimeline(trx)
      .where('rental.userId = :userId', {
        userId,
      })
      .orderBy('contract.updatedAt', 'DESC');
  }

  public getContractsQbOrderByTimeline(trx = this.manager) {
    return this.getContractsQb(trx).addOrderBy('timelines.timeStart', 'ASC');
  }

  public getContractsQb(trx = this.manager) {
    return trx
      .createQueryBuilder(Contract, 'contract')
      .leftJoinAndSelect('contract.rental', 'rental')
      .leftJoinAndSelect('rental.user', 'user')
      .leftJoinAndSelect('rental.locationRentals', 'locationRentals')
      .leftJoinAndSelect('locationRentals.location', 'location')
      .leftJoinAndSelect('rental.deviceRentals', 'deviceRentals')
      .leftJoinAndSelect('deviceRentals.device', 'device')
      .leftJoinAndSelect('contract.customer', 'customer')
      .leftJoinAndSelect(
        'rental.humanResourcesRentals',
        'humanResourcesRentals',
      )
      .leftJoinAndSelect(
        'humanResourcesRentals.humanResources',
        'humanResources',
      )
      .leftJoinAndSelect('rental.timelines', 'timelines');
  }

  public getContractFilterQb(
    query: GetContractsRequest,
    qb: SelectQueryBuilder<Contract>,
  ) {
    !_.isNil(query.status) &&
      qb.andWhere('contract.status = :status', { status: query.status });

    console.log(
      'query',
      qb.getQueryAndParameters(),
      _.isNil(query.status),
      query.status,
    );

    query.startTime &&
      query.endTime &&
      qb
        .andWhere(
          'CAST(rental.rental_start_time AS DATE) BETWEEN :startTime AND :endTime',
          {
            startTime: query.startTime,
            endTime: query.endTime,
          },
        )
        .andWhere(
          'CAST(rental.rental_end_time AS DATE) BETWEEN :startTime AND :endTime',
          {
            startTime: query.startTime,
            endTime: query.endTime,
          },
        );

    query.name &&
      qb.andWhere('contract.name ILIKE :name', {
        name: `%${query.name}%`,
      });

    return qb;
  }

  public async getContractById(contractId: string, trx = this.manager) {
    return await this.getContractsQbOrderByTimeline(trx)
      .where('contract.id = :contractId', {
        contractId,
      })
      .getOne();
  }
}
