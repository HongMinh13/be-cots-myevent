import { ResponseMessageBase } from '@/common/interfaces/returnBase';
import { EventTypeRepository } from '@/db/repositories/eventType.repository';
import { Injectable } from '@nestjs/common';
import { getManager } from 'typeorm';
import { CreateEventTypeRequest } from './dto/request/createEventType.request';
import { EventTypesData } from './dto/response/eventTypes.response';
import { QueryFilterDto } from '@/common/dtos/queryFilter';
import { getPaginationResponse } from '@/common/base/getPaginationResponse';

@Injectable()
export class EventTypeService {
  constructor(private readonly eventTypeRepository: EventTypeRepository) {}

  async createEvent(
    input: CreateEventTypeRequest,
  ): Promise<ResponseMessageBase> {
    const { ...eventType } = input;

    return getManager().transaction(async (trx) => {
      const existingEventType =
        await this.eventTypeRepository.getEventTypeByName(eventType.name, trx);
      if (existingEventType) {
        return { message: 'Loại sự kiện đã tồn tại', success: false };
      }

      await this.eventTypeRepository.saveEventType(eventType, trx);

      return { message: 'Tạo mới loại sự kiện thành công', success: true };
    });
  }

  async getEventTypes(input: QueryFilterDto): Promise<EventTypesData> {
    return getManager().transaction(async (trx) => {
      const queryBuilder = this.eventTypeRepository.getEventTypesQb(trx);

      const eventTypes = await getPaginationResponse(queryBuilder, input);

      return eventTypes;
    });
  }
}
