import { Injectable } from '@nestjs/common';
import { CreateEventRequest } from './dto/request/createEvent.request';
import { getManager } from 'typeorm';
import { ResponseMessageBase } from '@/common/interfaces/returnBase';
import { EventRepository } from '@/db/repositories/event.repository';
import { EventsData } from './dto/response/events.response';
import { getPaginationResponse } from '@/common/base/getPaginationResponse';
import { QueryFilterDto } from '@/common/dtos/queryFilter';
import { EventData } from './dto/response/event.response';
import {
  CreateEventTemplateRequest,
  UpdateEventTemplateRequest,
} from './dto/request/createEventTemplate.request';
import { Context } from '@/decorators/user.decorator';
import { RentalRepository } from '@/db/repositories/rental.repository';
import { HumanResourcesRentalRepository } from '@/db/repositories/humanResourceRental.repository';
import { DeviceRentalRepository } from '@/db/repositories/deviceRental.repository';
import { EventTypeRepository } from '@/db/repositories/eventType.repository';
import { TimelineRepository } from '@/db/repositories/timeline.repository';
import { GetEventsRequest } from './dto/request/getEvents.request';
import { Console } from 'console';

@Injectable()
export class EventService {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly rentalRepository: RentalRepository,
    private readonly deviceRentalRepository: DeviceRentalRepository,
    private readonly humanResourcesRentalRepository: HumanResourcesRentalRepository,
    private readonly eventTypeRepository: EventTypeRepository,
    private readonly timelineRepository: TimelineRepository,
  ) {}

  async createEvent(input: CreateEventRequest): Promise<ResponseMessageBase> {
    const { ...eventData } = input;

    return getManager().transaction(async (trx) => {
      await this.eventRepository.saveEvent({ ...eventData }, trx);

      return { message: 'Tạo sự kiện thành công', success: true };
    });
  }

  async createEventTemplate(
    input: CreateEventTemplateRequest,
    ctx: Context,
  ): Promise<ResponseMessageBase> {
    const {
      devices,
      humanResources,
      eventType,
      eventTypeId,
      timeline,
      ...eventData
    } = input;

    return getManager().transaction(async (trx) => {
      if (!eventTypeId && !eventType)
        return { message: 'Loại sự kiện là bắt buộc', success: false };

      let eventTypeData = { id: eventTypeId };

      if (!eventTypeId && eventType) {
        const existingEventType =
          await this.eventTypeRepository.getEventTypeByName(
            eventType.name,
            trx,
          );
        if (existingEventType) {
          return { message: 'Loại sự kiện đã tồn tại', success: false };
        }

        eventTypeData = await this.eventTypeRepository.saveEventType(
          eventType,
          trx,
        );
      }

      const event = await this.eventRepository.saveEvent(
        {
          ...eventData,
          isTemplate: true,
          eventTypeId: eventTypeData.id,
        },
        trx,
      );

      const rental = await this.rentalRepository.saveRental(
        {
          eventId: event.id,
          userId: ctx.currentUser.id,
        },
        trx,
      );

      const deviceRentals =
        devices?.map((device) => ({
          deviceId: device.id,
          quantity: device.quantity,
          rentalId: rental.id,
        })) ?? [];

      const humanResourcesRentals =
        humanResources?.map((hr) => ({
          humanResourcesId: hr.id,
          quantity: hr.quantity,
          rentalId: rental.id,
        })) ?? [];

      const timelineData =
        timeline?.map((tl) => ({
          ...tl,
          rentalId: rental.id,
        })) ?? [];

      deviceRentals.length &&
        (await this.deviceRentalRepository.saveDeviceRentals(
          deviceRentals,
          trx,
        ));
      humanResourcesRentals.length &&
        (await this.humanResourcesRentalRepository.saveHumanResourcesRentals(
          humanResourcesRentals,
          trx,
        ));

      timelineData.length &&
        (await this.timelineRepository.saveTimelines(timelineData, trx));

      return { message: 'Tạo mới mẫu sự kiện thành công', success: true };
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

  async getEventsTemplate(input: QueryFilterDto): Promise<EventsData> {
    return getManager().transaction(async (trx) => {
      const queryBuilder = this.eventRepository.getEventsTemplate(trx);

      const events = await getPaginationResponse(queryBuilder, input);

      return events;
    });
  }

  async getEventById(id: string): Promise<EventData> {
    return getManager().transaction(async (trx) => {
      const event = await this.eventRepository.getEventById(id, trx);

      return {
        ...event,
        rental: {
          ...event.rental,
          devices: event.rental.deviceRentals.map((deviceRental) => ({
            ...deviceRental.device,
            ...deviceRental,
            id: deviceRental.device.id,
          })),
          humanResources: event.rental.humanResourcesRentals.map(
            (hrRental) => ({
              ...hrRental.humanResources,
              ...hrRental,
              id: hrRental.humanResources.id,
            }),
          ),
          locations: event.rental.locationRentals.map((locationRental) => ({
            ...locationRental.location,
            ...locationRental,
            id: locationRental.location.id,
          })),
          timelines: event.rental.timelines.map((timeline) => ({
            ...timeline,
            id: timeline.id,
            startTime: timeline.timeStart,
          })),
          event: null,
        },
      };
    });
  }

  async updateEventTemplate(
    input: UpdateEventTemplateRequest,
  ): Promise<ResponseMessageBase> {
    return getManager().transaction(async (trx) => {
      const event = await this.eventRepository.getEventById(input.id, trx);

      if (!event) {
        return { message: 'Không tìm thấy sự kiện', success: false };
      }

      const { devices, humanResources, eventType, timeline, ...eventData } =
        input;

      let eventTypeData = { id: event.eventTypeId };

      if (eventData.eventTypeId) eventTypeData = { id: eventData.eventTypeId };

      if (!eventData.eventTypeId && eventType) {
        const existingEventType =
          await this.eventTypeRepository.getEventTypeByName(
            eventType.name,
            trx,
          );
        if (existingEventType) {
          return { message: 'Loại sự kiện đã tồn tại', success: false };
        }

        eventTypeData = await this.eventTypeRepository.saveEventType(
          eventType,
          trx,
        );
      }

      await this.eventRepository.updateEventTemplate(
        input.id,
        {
          ...eventData,
          eventTypeId: eventTypeData.id,
        },
        trx,
      );

      const devicesIds = new Set(devices?.map((device) => device.id));
      const devicesDelete = event?.rental?.deviceRentals?.filter(
        (device) => !devicesIds.has(device.id),
      );
      const devicesDeleteId = devicesDelete?.map((device) => device.id);
      const devicesSave = devices?.filter(
        (device) => !devicesDeleteId.includes(device.id),
      );

      const humanResourcesIds = new Set(
        humanResources?.map((humanResource) => humanResource.id),
      );
      const humanResourcesDelete = event?.rental?.humanResourcesRentals?.filter(
        (humanResource) => !humanResourcesIds.has(humanResource.id),
      );
      const humanResourcesDeleteId = humanResourcesDelete?.map(
        (humanResource) => humanResource.id,
      );
      const humanResourcesSave = humanResources?.filter(
        (humanResource) => !humanResourcesDeleteId.includes(humanResource.id),
      );

      const timelineIds = new Set(timeline?.map((timeline) => timeline?.id));
      const timelineDelete = event?.rental?.timelines?.filter(
        (timeline) => !timelineIds.has(timeline.id),
      );
      const timelineDeleteId = timelineDelete?.map((timeline) => timeline.id);
      const timelineUpdate = timeline?.filter(
        (timeline) => !timelineDeleteId.includes(timeline.id),
      );
      const timelineAdd = timeline?.filter((timeline) => !timeline.id);
      const timelineSave = timelineUpdate.concat(timelineAdd);

      devicesDelete?.length &&
        (await this.deviceRentalRepository.deleteDeviceRentals(
          devicesDelete,
          trx,
        ));

      humanResourcesDelete?.length &&
        (await this.humanResourcesRentalRepository.deleteHumanResourcesRentals(
          humanResourcesDelete,
          trx,
        ));

      timelineDelete?.length &&
        (await this.timelineRepository.deleteTimelines(timelineDelete, trx));

      devicesSave?.length &&
        (await this.deviceRentalRepository.saveDeviceRentals(
          devicesSave.map((device) => ({
            deviceId: device.id,
            quantity: device.quantity,
            rentalId: event.rental.id,
            id: event.rental.deviceRentals.find(
              (dr) => dr.deviceId === device.id,
            )?.id,
          })),
          trx,
        ));

      humanResourcesSave?.length &&
        (await this.humanResourcesRentalRepository.saveHumanResourcesRentals(
          humanResourcesSave.map((hr) => ({
            humanResourcesId: hr.id,
            quantity: hr.quantity,
            rentalId: event.rental.id,
            id: event.rental.humanResourcesRentals.find(
              (hrRental) => hrRental.humanResourcesId === hr.id,
            )?.id,
          })),
          trx,
        ));

      timelineSave?.length &&
        (await this.timelineRepository.saveTimelines(
          timelineSave.map((tl) => ({
            ...tl,
            rentalId: event.rental.id,
            id: event.rental.timelines.find((timeline) => timeline.id === tl.id)
              ?.id,
          })),
          trx,
        ));

      return { message: 'Cập nhật sự kiện mẫu thành công', success: true };
    });
  }

  public async deleteEventTemplate(id: string): Promise<ResponseMessageBase> {
    return getManager().transaction(async (trx) => {
      const event = await this.eventRepository.getEventById(id, trx);

      if (!event) {
        return { message: 'Không tìm thấy sự kiện', success: false };
      }

      const isEventInUse = await this.eventRepository.checkEventInUse(id, trx);

      if (isEventInUse > 1) {
        return { message: 'Sự kiện đã được sử dụng', success: false };
      }

      event?.rental?.timelines?.length &&
        (await this.timelineRepository.deleteTimelines(
          event.rental.timelines,
          trx,
        ));
      event?.rental?.deviceRentals?.length &&
        (await this.deviceRentalRepository.deleteDeviceRentals(
          event.rental.deviceRentals,
          trx,
        ));
      event?.rental?.humanResourcesRentals?.length &&
        (await this.humanResourcesRentalRepository.deleteHumanResourcesRentals(
          event.rental.humanResourcesRentals,
          trx,
        ));
      event?.rental?.id &&
        (await this.rentalRepository.deleteRental(event?.rental?.id, trx));

      await this.eventRepository.deleteEvent(id, trx);

      return { message: 'Xóa sự kiện mẫu thành công', success: true };
    });
  }
}
