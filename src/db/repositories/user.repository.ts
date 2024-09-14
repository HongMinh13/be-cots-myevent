import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { User, UserStatus } from '../entities/user.entity';
import { GetUsersRequest } from '@/main/shared/user/dto/request/getUsers.request';
import _ from 'lodash';

export type UserAttrs = Pick<
  User,
  'email' | 'password' | 'roleId' | 'lastName' | 'firstName' | 'phoneNumber'
>;

export class UserRepository extends Repository<User> {
  public getAllUsersQB(
    trx: EntityManager = this.manager,
  ): SelectQueryBuilder<User> {
    const queryBuilder = trx
      .getRepository(User)
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.role', 'role');

    return queryBuilder;
  }

  public async getUsersByIds(
    userIds: string[],
    trx: EntityManager = this.manager,
  ): Promise<User[]> {
    return trx.getRepository(User).findByIds(userIds);
  }

  public async saveUser(user: UserAttrs, trx: EntityManager = this.manager) {
    return trx.getRepository(User).save(user);
  }

  public async getUsesRental(
    rentalId: string,
    trx: EntityManager = this.manager,
  ): Promise<User[]> {
    const queryBuilder = trx
      .getRepository(User)
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.userRentals', 'userRental')
      .where('userRental.rentalId = :rentalId', { rentalId });

    return queryBuilder.getMany();
  }

  public getUsersQb(trx: EntityManager = this.manager) {
    return trx
      .createQueryBuilder(User, 'user')
      .leftJoinAndSelect('user.role', 'role');
  }

  public filterUsersQb(query: GetUsersRequest, qb: SelectQueryBuilder<User>) {
    const { search, status, role } = query;
    if (search) {
      qb.andWhere(
        '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (!_.isNil(status)) {
      qb.andWhere('user.status = :status', { status });
    }

    if (role) {
      qb.andWhere('role.name = :role', { role });
    }

    return qb;
  }

  public deactivateUser(id: string, trx: EntityManager = this.manager) {
    return trx
      .createQueryBuilder()
      .update(User)
      .set({ status: UserStatus.INACTIVE })
      .where('id = :id', { id })
      .execute();
  }

  public activateUser(id: string, trx: EntityManager = this.manager) {
    return trx
      .createQueryBuilder()
      .update(User)
      .set({ status: UserStatus.ACTIVE })
      .where('id = :id', { id })
      .execute();
  }

  public async changePassword(
    id: string,
    password: string,
    trx: EntityManager = this.manager,
  ) {
    return trx.getRepository(User).update(id, { password });
  }
}
