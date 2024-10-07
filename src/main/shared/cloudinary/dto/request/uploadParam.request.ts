import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class UploadRequest {
  @IsString()
  @Field(() => String)
  folder!: string;

  @Field(() => String)
  file!: string;
}
