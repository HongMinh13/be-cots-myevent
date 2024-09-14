import { PaginationInterface } from '@/common/interfaces/pagination';
import { ObjectType } from '@nestjs/graphql';
import { ContractData } from './contract.response';

@ObjectType({ isAbstract: true })
export class ContractsData extends PaginationInterface<ContractData>(
  ContractData,
) {}
