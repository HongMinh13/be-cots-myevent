import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './Role';

import { CustomBaseEntity } from '@/common/base/baseEntity';
import { Exclude, classToPlain } from 'class-transformer';
import { Title } from './Title';

export enum UserStatus {
  ACTIVE = 1,
  INACTIVE = 0,
}

@Entity('user')
export class User extends CustomBaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  avatar: string;

  @Column()
  phoneNumber: string;

  @Column()
  lastName: string;

  @Column()
  firstName: string;

  @Column()
  roleId: string;

  @Column()
  titleId: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column()
  email: string;

  @Column()
  dob: Date;

  @Column()
  gender: boolean;

  @Column()
  hourlySalary: number;

  @Column()
  status: UserStatus;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @ManyToOne(() => Title)
  @JoinColumn({ name: 'titleId' })
  title: Title;

  toPublic() {
    return classToPlain(this);
  }
}
