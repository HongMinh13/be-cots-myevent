import { CustomBaseEntity } from '@/common/base/baseEntity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmailSendLog } from './emailSendLog.entity';

export enum SENT_EMAIL_STATUS {
  UNSENT = 0,
  QUEUED = 1,
  SENDING = 2,
  SENT = 3,
  FAILED = 4,
}

@Entity('guest')
export class Guest extends CustomBaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: string;

  @Column({ name: 'email_send_log_id' })
  emailSendLogId: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'status' })
  status: SENT_EMAIL_STATUS;

  @Column({ nullable: true })
  error: string;

  @ManyToOne(() => EmailSendLog, (emailSendLog) => emailSendLog.guests)
  @JoinColumn({ name: 'email_send_log_id' })
  emailSendLog: EmailSendLog;
}
