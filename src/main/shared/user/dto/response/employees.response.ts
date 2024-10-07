import { PaginationInterface } from '@/common/interfaces/pagination';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export class EmployeeData {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  hourlySalary: number;

  @Field()
  availableQuantity: number;

  @Field({ nullable: true })
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt: Date;
}

@ObjectType({ isAbstract: true })
export class EmployeesData extends PaginationInterface<EmployeeData>(
  EmployeeData,
) {}
