import { CustomBaseEntity } from '@/common/base/baseEntity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from './event.entity';

@Entity({ name: 'event_type' })
export class EventType extends CustomBaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: string;

  @Column({ name: 'name' })
  name: string;

  @OneToMany(() => Event, (event) => event.eventType)
  events: Event[];
}
