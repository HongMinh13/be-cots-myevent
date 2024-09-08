import { Repository } from 'typeorm';
import { EventType } from '../entities/eventType.entity';

export type EventTypeAttrs = Partial<Pick<EventType, 'name'>>;

export class EventTypeRepository extends Repository<EventType> {
  public async getEventTypeByName(
    name: string,
    trx = this.manager,
  ): Promise<EventType> {
    return trx.findOne(EventType, { name });
  }

  public async saveEventType(
    eventType: EventTypeAttrs,
    trx = this.manager,
  ): Promise<EventType> {
    return trx.save(EventType, eventType);
  }

  public async getEventTypes(trx = this.manager): Promise<EventType[]> {
    return trx.find(EventType);
  }

  public getEventTypesQb(trx = this.manager) {
    return trx.createQueryBuilder(EventType, 'eventType');
  }
}
