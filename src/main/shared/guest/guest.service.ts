import { getPaginationResponse } from '@/common/base/getPaginationResponse';
import { GuestRepository } from '@/db/repositories/guest.repository';
import { Injectable } from '@nestjs/common';
import { GetGuestRequest } from './dto/request/getGuest.request';
import { Guest } from '@/db/entities/guest.entity';

@Injectable()
export class GuestService {
  constructor(private readonly guestRepository: GuestRepository) {}

  public async getGuestsByEmailSendLogId(input: GetGuestRequest) {
    const qb = Guest.createQueryBuilder('guest').where(
      'guest.emailSendLogId = :emailSendLogId',
      {
        emailSendLogId: input.emailSendLogId,
      },
    );

    const guests = await getPaginationResponse(qb, input);

    return guests;
  }
}
