import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';
import { Rental } from '../entities/rental.entity';
import { GetEventsRequest } from '@/main/shared/event/dto/request/getEvents.request';

export type EventAttrs = Partial<
  Pick<
    Event,
    | 'name'
    | 'description'
    | 'eventFormat'
    | 'eventTypeId'
    | 'img'
    | 'isTemplate'
    | 'onlineLink'
    | 'invitationLink'
  >
>;

export class EventRepository extends Repository<Event> {
  public async saveEvent(
    event: EventAttrs,
    trx = this.manager,
  ): Promise<Event> {
    return trx.save(Event, event);
  }

  public getEventsQb(trx = this.manager) {
    return trx
      .createQueryBuilder(Event, 'event')
      .leftJoinAndSelect('event.eventType', 'eventType')
      .leftJoinAndSelect('event.rental', 'rental')
      .leftJoinAndSelect('rental.user', 'user');
  }

  public filterEvent(query: GetEventsRequest, qb = this.getEventsQb()) {
    if (query.name) {
      qb.andWhere('event.name ILIKE :name', { name: `%${query.name}%` });
    }

    if (query.eventTypeId) {
      qb.andWhere('event.eventTypeId = :eventTypeId', {
        eventTypeId: query.eventTypeId,
      });
    }

    return qb;
  }

  public getEventsTemplate(trx = this.manager) {
    return this.getEventsQb(trx).where('event.isTemplate = true');
  }

  public async getEventById(id: string, trx = this.manager): Promise<Event> {
    return trx
      .createQueryBuilder(Event, 'event')
      .where('event.id = :id', { id })
      .leftJoinAndSelect('event.eventType', 'eventType')
      .leftJoinAndSelect('event.rental', 'rental')
      .leftJoinAndSelect('rental.user', 'user')
      .leftJoinAndSelect('rental.deviceRentals', 'deviceRentals')
      .leftJoinAndSelect(
        'rental.humanResourcesRentals',
        'humanResourcesRentals',
      )
      .leftJoinAndSelect('rental.locationRentals', 'locationRentals')
      .leftJoinAndSelect('deviceRentals.device', 'device')
      .leftJoinAndSelect(
        'humanResourcesRentals.humanResources',
        'humanResources',
      )
      .leftJoinAndSelect('locationRentals.location', 'location')
      .leftJoinAndSelect('rental.timelines', 'timelines')
      .orderBy('timelines.timeStart', 'ASC')
      .getOne();
  }

  public async updateEventTemplate(
    id: string,
    event: EventAttrs,
    trx = this.manager,
  ): Promise<Event> {
    return trx
      .createQueryBuilder()
      .update(Event)
      .set(event)
      .where('id = :id', { id })
      .execute()
      .then(() => this.getEventById(id, trx));
  }

  public async checkEventInUse(
    id: string,
    trx = this.manager,
  ): Promise<number> {
    return trx
      .createQueryBuilder(Rental, 'rental')
      .select('COUNT(*)')
      .where('rental.eventId = :id', { id })
      .getCount();
  }

  public async deleteEvent(id: string, trx = this.manager): Promise<void> {
    await trx.delete(Event, id);
  }
}
