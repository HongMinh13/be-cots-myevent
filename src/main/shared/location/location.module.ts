import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationResolver } from './location.resolver';
import { LocationRepository } from '@/db/repositories/location.repository';
import { LocationRentalRepository } from '@/db/repositories/locationRental.repository';

@Module({
  providers: [
    LocationResolver,
    LocationService,
    LocationRepository,
    LocationRentalRepository,
  ],
})
export class LocationModule {}
