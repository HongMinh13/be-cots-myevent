import { GuestRepository } from '@/db/repositories/guest.repository';
import { Module } from '@nestjs/common';
import { GuestResolver } from './guest.resolver';
import { GuestService } from './guest.service';

@Module({
  providers: [GuestResolver, GuestService, GuestRepository],
})
export class GuestModule {}
