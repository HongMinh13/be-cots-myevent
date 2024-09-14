import { CustomBaseEntity } from '@/common/base/baseEntity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DeviceRental } from './deviceRental.entity';

@Entity('device')
export class Device extends CustomBaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'img' })
  img: string;

  @Column({ name: 'hourly_rental_fee' })
  hourlyRentalFee: number;

  @Column({ name: 'quantity' })
  quantity: number;

  @Column({ name: 'description' })
  description: string;

  @OneToMany(() => DeviceRental, (deviceRental) => deviceRental.device)
  deviceRentals: DeviceRental[];

  //Virtual column
  @Column({
    type: 'bit',
    select: false,
    insert: false,
    update: false,
    nullable: true,
  })
  availableQuantity: number;
}
