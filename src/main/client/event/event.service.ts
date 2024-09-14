import { Injectable } from '@nestjs/common';
import { getManager } from 'typeorm';
import { getPaginationResponse } from '@/common/base/getPaginationResponse';
import { EventRepository } from '@/db/repositories/event.repository';
import { GetEventsRequest } from './dto/request/getEvents.request';
import { EventsData } from './dto/respone/events.response';
import { QueryFilterDto } from '@/common/dtos/queryFilter';


@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}


  async getEventsTemplate(input: QueryFilterDto): Promise<any> {
    return getManager().transaction(async (trx) => {
      const queryBuilder = await this.eventRepository.getEventsQb(trx);

      const events = await getPaginationResponse(queryBuilder, input);

      return events;
    });
  }

  async getEvents(input: GetEventsRequest): Promise<EventsData> {
    return getManager().transaction(async (trx) => {
      const queryBuilder = this.eventRepository.getEventsQb(trx);

      const queryBuilderFiltered = this.eventRepository.filterEvent(
        input,
        queryBuilder,
      );

      const events = await getPaginationResponse(queryBuilderFiltered, input);

      return events;
    });
  }

  async getEventById(id: string) {
    return getManager().transaction(async (trx) => {
      const event = await this.eventRepository.getEventById(id, trx);

      return event;
    });
  }
}
