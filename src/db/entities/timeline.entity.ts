import { CustomBaseEntity } from '@/common/base/baseEntity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Rental } from './rental.entity';

@Entity('timeline')
export class Timeline extends CustomBaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: string;

  @Column({ name: 'rental_id' })
  rentalId: string;

  @Column({ name: 'time_start' })
  timeStart: Date;

  @Column({ name: 'description' })
  description: string;

  @ManyToOne(() => Rental, (rental) => rental.timelines)
  @JoinColumn({ name: 'rental_id' })
  rental: Rental;
}
