import { CustomBaseEntity } from '@/common/base/baseEntity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LocationRental } from './locationRental.entity';

@Entity('location')
export class Location extends CustomBaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'img' })
  img: string;

  @Column({ name: 'hourly_rental_fee' })
  hourlyRentalFee: number;

  @Column({ name: 'address' })
  address: string;

  @OneToMany(() => LocationRental, (locationRental) => locationRental.location)
  locationRentals: LocationRental[];
}
