import { Repository } from 'typeorm';
import { Guest } from '../entities/guest.entity';

export class GuestRepository extends Repository<Guest> {
  public getGuestsByEventId(eventId: string, trx = this.manager) {
    return trx
      .createQueryBuilder(Guest, 'guest')
      .where('guest.eventId = :eventId', {
        eventId,
      });
  }
}
