import { PaginationInterface } from '@/common/interfaces/pagination';
import { RoleData } from '@/main/shared/user/dto/response/role.response';
import { ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export class IRole extends RoleData {}

@ObjectType({ isAbstract: true })
export class IRoles extends PaginationInterface<IRole>(IRole) {}
