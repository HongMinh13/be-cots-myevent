import { GuestData } from '@/main/shared/guest/dto/response/guest.response';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export class EmailSendLogData {
  @Field()
  id: string;

  @Field()
  fileName: string;

  @Field()
  contractId: string;

  @Field()
  createdAt: Date;

  // @Field()
  // order: number;

  @Field(() => [GuestData])
  guests: GuestData[];
}
