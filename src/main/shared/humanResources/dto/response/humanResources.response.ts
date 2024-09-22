import { PaginationInterface } from '@/common/interfaces/pagination';
import { ObjectType } from '@nestjs/graphql';
import { HumanResourceData } from './humanResource.response';

@ObjectType({ isAbstract: true })
export class HumanResourcesData extends PaginationInterface<HumanResourceData>(
  HumanResourceData,
) {}
