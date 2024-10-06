import { ObjectType } from '@nestjs/graphql';
import { UserData } from './user.response';
import { PaginationInterface } from '@/common/interfaces/pagination';

@ObjectType({ isAbstract: true })
export class UsersData extends PaginationInterface<UserData>(UserData) {}
