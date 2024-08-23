import { CustomBaseEntity } from '@/common/base/baseEntity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('role')
export class Role extends CustomBaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;
}
