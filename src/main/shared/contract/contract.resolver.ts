import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ContractService } from './contract.service';
import { QueryFilterDto } from '@/common/dtos/queryFilter';
import { Roles } from '@/decorators/roles.decorator';
import { Auth } from '@/decorators/auth.decorator';
import { ROLE } from '@/common/constant';
import { Context, GetContext } from '@/decorators/user.decorator';
import { ConfirmContractDeposit } from './dto';
import { UpdateContractStatusDto } from './dto';
import { CheckoutStripeResponse } from '@/main/shared/stripe/interface';
import { DepositContractDto } from '@/main/shared/stripe/dto';
import { ContractData } from './dto/response/contract.response';
import { ContractsData } from './dto/response/contracts.response';
import { GetContractsRequest } from './dto/request/getContracts.request';

@Auth(['Roles'])
@Resolver()
export class ContractResolver {
  constructor(private contractService: ContractService) {}

  @Query(() => ContractData)
  getContract(@Args('id') id: string) {
    return this.contractService.getContractById(id);
  }

  @Roles(ROLE.Admin)
  @Query(() => ContractsData)
  getContracts(@Args('queryParams') query: GetContractsRequest) {
    return this.contractService.getContracts(query);
  }

  @Query(() => ContractsData)
  getMyContracts(
    @Args('queryParams') query: GetContractsRequest,
    @GetContext() ctx: Context,
  ) {
    return this.contractService.getMyContracts(query, ctx.currentUser);
  }

  @Mutation(() => ContractData)
  confirmContractDeposit(
    @Args('input') input: ConfirmContractDeposit,
    @GetContext() ctx: Context,
  ) {
    return this.contractService.confirmContractDeposit(input, ctx.currentUser);
  }

  @Roles(ROLE.Admin)
  @Mutation(() => ContractData)
  updateStatusContract(@Args('input') input: UpdateContractStatusDto) {
    return this.contractService.updateStatusContract(input);
  }

  @Query(() => CheckoutStripeResponse, {
    name: 'checkoutRemainBillingContract',
  })
  checkoutRemainBillingContract(
    @Args('input') input: DepositContractDto,
    @GetContext() ctx: Context,
  ) {
    return this.contractService.checkoutRemainBillingContract(
      input,
      ctx.currentUser,
    );
  }
}
