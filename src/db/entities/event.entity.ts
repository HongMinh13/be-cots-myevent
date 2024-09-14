import { CustomBaseEntity } from '@/common/base/baseEntity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventType } from './eventType.entity';
import { Rental } from './rental.entity';

@Entity('event')
export class Event extends CustomBaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'detail' })
  detail: string;

  @Column({ name: 'img' })
  img: string;

  @Column({ name: 'event_type_id' })
  eventTypeId: string;

  @Column({ name: 'event_format' })
  eventFormat: boolean;

  @Column({ name: 'is_template' })
  isTemplate: boolean;

  @Column({ name: 'online_link' })
  onlineLink: string;

  @Column({ name: 'invitation_link' })
  invitationLink: string;

  @ManyToOne(() => EventType, (eventType) => eventType.events)
  @JoinColumn({ name: 'event_type_id' })
  eventType: EventType;

  @OneToOne(() => Rental, (rental) => rental.event)
  rental: Rental;
}
