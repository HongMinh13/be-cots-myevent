import { Module } from '@nestjs/common';
import { HumanResourceResolver } from './humanResource.resolver';
import { HumanResourcesRentalRepository } from '@/db/repositories/humanResourceRental.repository';
import { HumanResourcesRepository } from '@/db/repositories/humanResources.repository';
import { HumanResourceService } from './humanResource.service';

@Module({
  providers: [
    HumanResourceResolver,
    HumanResourceService,
    HumanResourcesRepository,
    HumanResourcesRentalRepository,
  ],
})
export class HumanResourceModule {}
