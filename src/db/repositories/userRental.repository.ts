// import { Repository } from 'typeorm';
// import { UserRental } from '../entities/userRental.entity';

// export type UserRentalAttrs = Pick<UserRental, 'userId' | 'rentalId'>;

// export class UserRentalRepository extends Repository<UserRental> {
//   public async saveUserRentals(
//     userRentals: UserRentalAttrs[],
//     trx = this.manager,
//   ): Promise<void> {
//     await trx.save(UserRental, userRentals);
//   }

//   public async getUsersRentalByRentalId(
//     rentalId: string,
//     trx = this.manager,
//   ): Promise<UserRental[]> {
//     return trx
//       .createQueryBuilder(UserRental, 'ur')
//       .innerJoinAndSelect('ur.user', 'user')
//       .where('ur.rentalId = :rentalId', { rentalId })
//       .getMany();
//   }
// }
