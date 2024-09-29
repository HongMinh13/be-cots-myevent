import { PaginationInterface } from '@/common/interfaces/pagination';
import { ObjectType } from '@nestjs/graphql';
import { GuestData } from './guest.response';

@ObjectType({ isAbstract: true })
export class GuestsData extends PaginationInterface<GuestData>(GuestData) {}
