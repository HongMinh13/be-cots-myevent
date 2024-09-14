import { registerEnumType } from '@nestjs/graphql';
import { UserVerificationRequestType } from './userVerificationRequest.entity';
import { CONTRACT_STATUS } from './contract.entity';
import { UserStatus } from './user.entity';
import { SENT_EMAIL_STATUS } from './guest.entity';

registerEnumType(UserVerificationRequestType, {
  name: 'UserVerificationRequestType',
});

registerEnumType(CONTRACT_STATUS, {
  name: 'CONTRACT_STATUS',
});

registerEnumType(SENT_EMAIL_STATUS, {
  name: 'SENT_EMAIL_STATUS',
});

registerEnumType(UserStatus, {
  name: 'UserStatus',
});
