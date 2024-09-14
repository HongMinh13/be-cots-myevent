import { InputType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class CreateEmployeeRequest {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  lastName: string;

  @Field()
  firstName: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  phoneNumber: string;

  @Field({ nullable: true })
  hourlySalary: number;
}
