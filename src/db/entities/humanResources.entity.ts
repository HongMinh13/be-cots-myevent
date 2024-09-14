import { CustomBaseEntity } from '@/common/base/baseEntity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { HumanResourcesRental } from './humanResourcesRental.entity';

@Entity('human_resources')
export class HumanResources extends CustomBaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'hourly_salary' })
  hourlySalary: number;

  @Column({ name: 'quantity' })
  quantity: number;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'img', nullable: true })
  img: string;

  @OneToMany(
    () => HumanResourcesRental,
    (humanResourcesRental) => humanResourcesRental.humanResources,
  )
  humanResourcesRentals: HumanResourcesRental[];

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
