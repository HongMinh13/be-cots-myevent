import { CustomBaseEntity } from '@/common/base/baseEntity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Rental } from './rental.entity';
import { Device } from './device.entity';

@Entity('device_rental')
export class DeviceRental extends CustomBaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: string;

  @Column({ name: 'device_id' })
  deviceId: string;

  @Column({ name: 'rental_id' })
  rentalId: string;

  @Column({ name: 'quantity' })
  quantity: number;

  @ManyToOne(() => Rental, (rental) => rental.deviceRentals)
  @JoinColumn({ name: 'rental_id' })
  rental: Rental;

  @ManyToOne(() => Device, (device) => device.deviceRentals)
  @JoinColumn({ name: 'device_id' })
  device: Device;
}
