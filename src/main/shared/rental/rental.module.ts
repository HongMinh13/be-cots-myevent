import { Module } from '@nestjs/common';
import { RentalService } from './rental.service';
import { RentalResolver } from './rental.resolver';
import { DeviceRepository } from '@/db/repositories/device.repository';
import { DeviceRentalRepository } from '@/db/repositories/deviceRental.repository';
import { LocationRentalRepository } from '@/db/repositories/locationRental.repository';
import { LocationRepository } from '@/db/repositories/location.repository';
import { RentalRepository } from '@/db/repositories/rental.repository';
import { ContractRepository } from '@/db/repositories/contract.repository';
import { HumanResourcesRentalRepository } from '@/db/repositories/humanResourceRental.repository';
import { HumanResourcesRepository } from '@/db/repositories/humanResources.repository';
import { CustomerRepository } from '@/db/repositories/customer.repository';
import { TimelineRepository } from '@/db/repositories/timeline.repository';

@Module({
  providers: [
    RentalResolver,
    RentalService,
    DeviceRepository,
    DeviceRentalRepository,
    LocationRentalRepository,
    LocationRepository,
    RentalRepository,
    HumanResourcesRepository,
    HumanResourcesRentalRepository,
    ContractRepository,
    CustomerRepository,
    TimelineRepository,
  ],
  exports: [RentalService],
})
export class RentalModule {}
