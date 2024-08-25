import { ObjectType, PickType } from '@nestjs/graphql';

import { PaginationInterface } from '@/common/interfaces/pagination';
import { UserData } from '../dto/response/user.response';

@ObjectType({ isAbstract: true })
export class IUser extends PickType(UserData, [
  'id',
  'avatar',
  'email',
  'firstName',
  'lastName',
  'phoneNumber',
  'role',
  'roleId',
  'createdAt',
  'updatedAt',
]) {}

@ObjectType({ isAbstract: true })
export class IUsers extends PaginationInterface<IUser>(IUser) {}
