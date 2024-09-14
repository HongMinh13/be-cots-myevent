import { EventTypeRepository } from '@/db/repositories/eventType.repository';
import { Injectable } from '@nestjs/common';
import { getManager } from 'typeorm';
import { QueryFilterDto } from '@/common/dtos/queryFilter';
import { getPaginationResponse } from '@/common/base/getPaginationResponse';

@Injectable()
export class EventTypeService {
  constructor(private readonly eventTypeRepository: EventTypeRepository) {}

  async getEventTypes(input: QueryFilterDto): Promise<any> {
    return getManager().transaction(async (trx) => {
      const queryBuilder = this.eventTypeRepository.getEventTypesQb(trx);

      const eventTypes = await getPaginationResponse(queryBuilder, input);

      return eventTypes;
    });
  }
}
