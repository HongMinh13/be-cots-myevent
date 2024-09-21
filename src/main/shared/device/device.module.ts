import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceResolver } from './device.resolver';
import { DeviceRepository } from '@/db/repositories/device.repository';
import { DeviceRentalRepository } from '@/db/repositories/deviceRental.repository';

@Module({
  providers: [
    DeviceResolver,
    DeviceService,
    DeviceRepository,
    DeviceRentalRepository,
  ],
})
export class DeviceModule {}
