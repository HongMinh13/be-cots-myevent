import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';

import { CustomBaseEntity } from '@/common/base/baseEntity';
import { Exclude, classToPlain } from 'class-transformer';
import { Rental } from './rental.entity';

export enum UserStatus {
  ACTIVE = 1,
  INACTIVE = 0,
}

@Entity('user')
export class User extends CustomBaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: string;

  @Column({ name: 'avatar' })
  avatar: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'role_id' })
  roleId: string;

  @Column({ name: 'password' })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'dob' })
  dob: Date;

  @Column({ name: 'gender' })
  gender: boolean;

  @Column({ name: 'status', default: 1 })
  status: UserStatus = 1;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @OneToMany(() => Rental, (rental) => rental.user)
  rentals: Rental[];

  toPublic() {
    return classToPlain(this);
  }
}
