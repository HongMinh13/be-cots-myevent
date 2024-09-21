import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventResolver } from './event.resolver';
import { EventRepository } from '@/db/repositories/event.repository';
import { DeviceRentalRepository } from '@/db/repositories/deviceRental.repository';
import { HumanResourcesRentalRepository } from '@/db/repositories/humanResourceRental.repository';
import { RentalRepository } from '@/db/repositories/rental.repository';
import { EventTypeRepository } from '@/db/repositories/eventType.repository';
import { TimelineRepository } from '@/db/repositories/timeline.repository';

@Module({
  providers: [
    EventResolver,
    EventService,
    EventRepository,
    RentalRepository,
    DeviceRentalRepository,
    HumanResourcesRentalRepository,
    EventTypeRepository,
    TimelineRepository,
  ],
})
export class EventModule {}
