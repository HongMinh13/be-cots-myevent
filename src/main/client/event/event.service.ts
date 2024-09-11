import { Injectable } from '@nestjs/common';
import { getManager } from 'typeorm';
import { getPaginationResponse } from '@/common/base/getPaginationResponse';
import { QueryFilterDto } from '@/common/dtos/queryFilter';
import { EventRepository } from '@/db/repositories/event.repository';
import { EventData } from 'aws-sdk/clients/ssmincidents';


@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}


  async getEvents(input: QueryFilterDto): Promise<any> {
    return getManager().transaction(async (trx) => {
      const queryBuilder = await this.eventRepository.getEventsQb(trx);

      const events = await getPaginationResponse(queryBuilder, input);

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
