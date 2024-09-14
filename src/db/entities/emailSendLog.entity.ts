import { CustomBaseEntity } from '@/common/base/baseEntity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Contract } from './contract.entity';
import { Guest } from './guest.entity';

@Entity('email_send_log')
export class EmailSendLog extends CustomBaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: string;

  @Column({ name: 'contract_id' })
  contractId: string;

  @Column({ name: 'file_name' })
  fileName: string;

  @ManyToOne(() => Contract)
  @JoinColumn({ name: 'contract_id' })
  contract: Contract;

  @OneToMany(() => Guest, (guest) => guest.emailSendLog)
  guests: Guest[];

  //Virtual column
  @Column({
    type: 'bit',
    select: false,
    insert: false,
    update: false,
    nullable: true,
  })
  order: number;
}
