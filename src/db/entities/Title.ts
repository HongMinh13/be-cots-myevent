import { CustomBaseEntity } from '@/common/base/baseEntity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('title')
export class Title extends CustomBaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;
}
