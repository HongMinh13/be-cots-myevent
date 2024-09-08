import { CustomBaseEntity } from '@/common/base/baseEntity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Rental } from './rental.entity';
import { Location } from './location.entity';

@Entity('location_rental')
export class LocationRental extends CustomBaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: string;

  @Column({ name: 'location_id' })
  locationId: string;

  @Column({ name: 'rental_id' })
  rentalId: string;

  @ManyToOne(() => Rental, (rental) => rental.locationRentals)
  @JoinColumn({ name: 'rental_id' })
  rental: Rental;

  @ManyToOne(() => Location, (location) => location.locationRentals)
  @JoinColumn({ name: 'location_id' })
  location: Location;
}
