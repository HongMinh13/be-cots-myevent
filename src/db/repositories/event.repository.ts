import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';

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
    | 'rentalId'
  >
>;

export class EventRepository extends Repository<Event> {
  public async saveEvent(
    event: EventAttrs,
    trx = this.manager,
  ): Promise<Event> {
    return trx.save(Event, event);
  }

  public async getEventsQb(trx = this.manager) { // xem ds
    return trx
      .createQueryBuilder(Event, 'event')
      .leftJoinAndSelect('event.eventType', 'eventType')
      .leftJoinAndSelect('event.rental', 'rental')
      .leftJoinAndSelect('rental.user', 'user');
  }

  public async getEventById(id: string, trx = this.manager): Promise<Event> { // xem chi tiet
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
      .getOne();
  }
}
