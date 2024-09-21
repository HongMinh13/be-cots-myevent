import { PaginationInterface } from '@/common/interfaces/pagination';
import { ObjectType } from '@nestjs/graphql';
import { EventTypeData } from './eventType.response';

@ObjectType({ isAbstract: true })
export class EventTypesData extends PaginationInterface<EventTypeData>(
  EventTypeData,
) {}
