import { SENT_EMAIL_STATUS } from '@/db/entities/guest.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export class GuestData {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  emailSendLogId: string;

  @Field()
  createdAt: Date;

  @Field(() => SENT_EMAIL_STATUS)
  status: SENT_EMAIL_STATUS;
}
