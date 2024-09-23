import { Auth } from '@/decorators/auth.decorator';
import { GuestService } from './guest.service';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { GuestsData } from './dto/response/guests.response';
import { GetGuestRequest } from './dto/request/getGuest.request';

@Auth(['Roles'])
@Resolver()
export class GuestResolver {
  constructor(private service: GuestService) {}

  @Query(() => GuestsData)
  async getGuestsByEmailSendLogId(@Args('input') input: GetGuestRequest) {
    return this.service.getGuestsByEmailSendLogId(input);
  }
}
