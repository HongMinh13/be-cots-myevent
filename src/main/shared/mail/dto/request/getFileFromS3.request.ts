import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class GetFileFromS3Request {
  @Field()
  key: string;
}

@InputType()
export class SendEmailRequest extends GetFileFromS3Request {
  @Field(() => ID)
  contractId: string;
}
