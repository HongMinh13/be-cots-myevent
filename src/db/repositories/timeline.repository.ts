import { Repository } from 'typeorm';
import { Timeline } from '../entities/timeline.entity';

export type TimelineAttrs = Partial<
  Pick<Timeline, 'timeStart' | 'description' | 'rentalId'>
>;

export class TimelineRepository extends Repository<Timeline> {
  public async saveTimelines(
    timelines: TimelineAttrs[],
    trx = this.manager,
  ): Promise<Timeline[]> {
    return await trx.save(Timeline, timelines);
  }

  public async getTimelinesByRentalId(
    rentalId: string,
    trx = this.manager,
  ): Promise<Timeline[]> {
    return await trx.find(Timeline, { where: { rentalId } });
  }

  public async deleteTimelines(
    timelines: TimelineAttrs[],
    trx = this.manager,
  ): Promise<void> {
    await trx.delete(Timeline, timelines);
  }
}
