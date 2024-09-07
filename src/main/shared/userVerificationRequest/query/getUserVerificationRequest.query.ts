import { UserVerificationRequest } from '@/db/entities/UserVerificationRequest';
import { messageKey } from '@/i18n';
import { BadRequestException } from '@nestjs/common';
import dayjs from 'dayjs';

export class GetUserVerificationRequestQuery {
  static async verify(email: string, code: string) {
    const verificationRequest = await UserVerificationRequest.findOne({
      where: { email, code },
    });

    if (
      !verificationRequest
    ) {
      throw new BadRequestException(messageKey.BASE.CODE_INCORRECT_OR_EXPIRED);
    }

    return verificationRequest;
  }
}
