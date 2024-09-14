import {
  Brackets,
  EntityManager,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { HumanResources } from '../entities/humanResources.entity';
import { HumanResourcesRentalAttrs } from './humanResourceRental.repository';
import { HumanResourcesRental } from '../entities/humanResourcesRental.entity';

export type humanResourcesAttrs = Partial<
  Pick<HumanResources, 'name' | 'quantity' | 'hourlySalary'>
>;

export class HumanResourcesRepository extends Repository<HumanResources> {
  public baseGetHumanResourcesAvailableQB(
    startTime: Date,
    endTime: Date,
    trx: EntityManager = this.manager,
  ): SelectQueryBuilder<HumanResources> {
    const queryBuilder = trx
      .createQueryBuilder(HumanResources, 'human_resources')
      .leftJoin(
        (qb) =>
          qb
            .subQuery()
            .select('COALESCE(SUM(dr.quantity), 0)', 'total')
            .addSelect('dr.human_resources_id', 'human_resources_id')
            .from('human_resources_rental', 'dr')
            .leftJoin('rental', 'rental', 'dr.rental_id = rental.id')
            .where('rental.rental_start_time <= :startTime', { startTime })
            .andWhere('rental.rental_end_time >= :endTime', { endTime })
            .groupBy('dr.human_resources_id'),
        'human_resources_rented',
        'human_resources.id = human_resources_rented.human_resources_id',
      )
      .addSelect(
        'human_resources.quantity - COALESCE(human_resources_rented.total, 0)',
        'human_resources_available_quantity',
      )
      .andWhere(
        'human_resources.quantity - COALESCE(human_resources_rented.total, 0) > 0',
      )
      .setParameters({ startTime, endTime })
      .orderBy('human_resources.id', 'ASC');

    return queryBuilder;
  }

  public async getExistingHumanResourcesRented(
    humanResourcesRentals: HumanResourcesRentalAttrs[],
    startTime: Date,
    endTime: Date,
    trx: EntityManager = this.manager,
  ): Promise<HumanResources[]> {
    const humanResourcesRentalQuantities = humanResourcesRentals.reduce(
      (acc, dr) => {
        acc[dr.humanResourcesId] = dr.quantity;
        return acc;
      },
      {} as Record<number, number>,
    );

    const existingHumanResourcesRented = [];

    for (const humanResourcesRental of humanResourcesRentals) {
      const queryBuilder = trx
        .createQueryBuilder(HumanResources, 'human_resources')
        .where('human_resources.id = :humanResourcesId', {
          humanResourcesId: humanResourcesRental.humanResourcesId,
        })
        .andWhere((qb) => {
          const subQuery = qb
            .subQuery()
            .select('COALESCE(SUM(dr.quantity), 0)', 'total')
            .from('human_resources_rental', 'dr')
            .leftJoin('rental', 'rental', 'dr.rental_id = rental.id')
            .where('dr.human_resources_id = human_resources.id')
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
          return `human_resources.quantity - (${subQuery}) < ${
            humanResourcesRentalQuantities[
              humanResourcesRental.humanResourcesId
            ]
          }`;
        })
        .setParameter('startTime', startTime)
        .setParameter('endTime', endTime)
        .orderBy('human_resources.id', 'ASC');

      const humanResources = await queryBuilder.getOne();

      if (humanResources) {
        existingHumanResourcesRented.push(humanResources);
      }
    }

    return existingHumanResourcesRented;
  }

  public async getHumanResourcesByIds(
    humanResourcesIds: string[],
    trx: EntityManager = this.manager,
  ): Promise<HumanResources[]> {
    return trx
      .createQueryBuilder(HumanResources, 'humanResources')
      .where('humanResources.id IN (:...humanResourcesIds)', {
        humanResourcesIds,
      })
      .getMany();
  }

  public async saveHumanResources(
    humanResources: humanResourcesAttrs,
    trx: EntityManager = this.manager,
  ): Promise<void> {
    await trx.getRepository(HumanResources).save(humanResources);
  }

  public getHumanResourcesQb(
    trx: EntityManager = this.manager,
  ): SelectQueryBuilder<HumanResources> {
    return trx.createQueryBuilder(HumanResources, 'humanResources');
  }

  public async updateHumanResources(
    humanResourcesId: string,
    humanResources: humanResourcesAttrs,
    trx: EntityManager = this.manager,
  ): Promise<void> {
    await trx
      .getRepository(HumanResources)
      .update(humanResourcesId, humanResources);
  }

  public getHumanResourceId(
    humanResourcesId: string,
    trx: EntityManager = this.manager,
  ): Promise<HumanResources> {
    return trx
      .createQueryBuilder(HumanResources, 'humanResources')
      .where('humanResources.id = :humanResourcesId', { humanResourcesId })
      .getOne();
  }

  public async checkHumanResourcesInUse(
    humanResourcesId: string,
    trx: EntityManager = this.manager,
  ) {
    return await trx
      .createQueryBuilder(HumanResourcesRental, 'dr')
      .where('dr.human_resources_id = :humanResourcesId', {
        humanResourcesId,
      })
      .getCount();
  }

  public async deleteHumanResources(
    humanResourcesId: string,
    trx: EntityManager = this.manager,
  ): Promise<void> {
    await trx.getRepository(HumanResources).delete(humanResourcesId);
  }
}
