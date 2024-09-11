import { PaginationInterface } from '@/common/interfaces/pagination';
import { ObjectType } from '@nestjs/graphql';
import { EventData } from './event.response';

@ObjectType({ isAbstract: true })
export class EventsData extends PaginationInterface<EventData>(EventData) {}
