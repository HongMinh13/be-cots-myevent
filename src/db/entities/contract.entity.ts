import { CustomBaseEntity } from '@/common/base/baseEntity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Rental } from './rental.entity';
import { getJoinRelation } from '@/providers/selectionUtils';
import { GraphQLResolveInfo } from 'graphql';
import { Customer } from './customer.entity';

export enum CONTRACT_STATUS {
  Draft = 0,
  DepositPaid = 1,
  InProgress = 2,
  WaitingPaid = 3,
  Completed = 4,
  Cancel = 5,
  AdminCancel = 6,
}

@Entity('contract')
export class Contract extends CustomBaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'rental_id' })
  rentalId: string;

  @Column({ name: 'customer_id' })
  customerId: string;

  @Column({ name: 'signing_date' })
  signingDate: Date;

  @Column({ name: 'status' })
  status: CONTRACT_STATUS;

  @Column({ name: 'payment_intent_id' })
  paymentIntentId: string;

  @OneToOne(() => Rental)
  @JoinColumn({ name: 'rental_id' })
  rental: Rental;

  @OneToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  static getRelations(
    info: GraphQLResolveInfo,
    withPagination?: boolean,
    forceInclude?: string[],
  ): string[] {
    const fields = [['rental'], ['rental', 'user']];
    return getJoinRelation(info, fields, withPagination, forceInclude);
  }
}
