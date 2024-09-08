import { CustomBaseEntity } from '@/common/base/baseEntity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { HumanResources } from './humanResources.entity';
import { Rental } from './rental.entity';

@Entity('human_resources_rental')
export class HumanResourcesRental extends CustomBaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: string;

  @Column({ name: 'human_resources_id' })
  humanResourcesId: string;

  @Column({ name: 'rental_id' })
  rentalId: string;

  @Column({ name: 'quantity' })
  quantity: number;

  @ManyToOne(() => Rental, (rental) => rental.humanResourcesRentals)
  @JoinColumn({ name: 'rental_id' })
  rental: Rental;

  @ManyToOne(
    () => HumanResources,
    (humanResources) => humanResources.humanResourcesRentals,
  )
  @JoinColumn({ name: 'human_resources_id' })
  humanResources: HumanResources;
}
