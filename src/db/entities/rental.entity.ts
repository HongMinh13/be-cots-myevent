import { CustomBaseEntity } from '@/common/base/baseEntity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DeviceRental } from './deviceRental.entity';
import { LocationRental } from './locationRental.entity';
import { Event } from './event.entity';
import { User } from './user.entity';
import { HumanResourcesRental } from './humanResourcesRental.entity';
import { Timeline } from './timeline.entity';
import { Contract } from './contract.entity';

@Entity('rental')
export class Rental extends CustomBaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'event_id' })
  eventId: string;

  @Column({ name: 'total_price' })
  totalPrice: number;

  @Column({ name: 'rental_start_time' })
  rentalStartTime: Date;

  @Column({ name: 'rental_end_time' })
  rentalEndTime: Date;

  @Column({ name: 'custom_location' })
  customLocation: string;

  @OneToMany(() => DeviceRental, (deviceRental) => deviceRental.rental)
  deviceRentals: DeviceRental[];

  @OneToMany(
    () => HumanResourcesRental,
    (humanResourcesRental) => humanResourcesRental.rental,
  )
  humanResourcesRentals: HumanResourcesRental[];

  @OneToMany(() => LocationRental, (locationRental) => locationRental.rental)
  locationRentals: LocationRental[];

  @OneToOne(() => Event, (event) => event.rental)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @ManyToOne(() => User, (user) => user.rentals)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Timeline, (timeline) => timeline.rental)
  timelines: Timeline[];

  @OneToOne(() => Contract, (contract) => contract.rental)
  contract: Contract;

  //Virtual column
  @Column({
    type: 'bit',
    select: false,
    insert: false,
    update: false,
    nullable: true,
  })
  monthlyRevenue: number;
}
