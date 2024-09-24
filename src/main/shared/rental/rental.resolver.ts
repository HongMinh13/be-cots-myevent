import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { RentalService } from './rental.service';
import { ResponseMessageBase } from '@/common/interfaces/returnBase';
import { RentalServicesRequest } from './dto/request/rentalServices.request';
import { GetContext, Context } from '@/decorators/user.decorator';
import { Auth } from '@/decorators/auth.decorator';

@Resolver()
export class RentalResolver {
  constructor(private service: RentalService) {}

  @Auth()
  @Mutation(() => ResponseMessageBase, { name: 'rentalServices' })
  async rentalServices(
    @Args('input') input: RentalServicesRequest,
    @GetContext() ctx: Context,
  ): Promise<ResponseMessageBase> {
    return await this.service.rentalServices(input, ctx);
  }
}
