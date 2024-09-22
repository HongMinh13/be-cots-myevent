import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { HumanResourceService } from './humanResource.service';
import { ResponseMessageBase } from '@/common/interfaces/returnBase';
import {
  CreateHumanResourcesRequest,
  UpdateHumanResourcesRequest,
} from './dto/request/createHumanResources.request';
import { HumanResourcesData } from './dto/response/humanResources.response';
import { GetServicesRequest } from '../../../common/dtos/getServices.request';
import { HumanResourceRentalData } from './dto/response/humanResourceRental.response';
import { HumanResourceData } from './dto/response/humanResource.response';
import { Auth } from '@/decorators/auth.decorator';
import { ROLE } from '@/common/constant';
import { Roles } from '@/decorators/roles.decorator';
import { QueryFilterDto } from '@/common/dtos/queryFilter';

@Auth(['Roles'])
@Resolver()
export class HumanResourceResolver {
  constructor(private service: HumanResourceService) {}

  @Query(() => HumanResourcesData)
  async getHumanResourcesAvailable(
    @Args('input') input: GetServicesRequest,
  ): Promise<HumanResourcesData> {
    return this.service.getHumanResourcesAvailable(input);
  }

  @Query(() => [HumanResourceRentalData])
  async getHumanResourcesRental(
    @Args('rentalId') rentalId: string,
  ): Promise<HumanResourceRentalData[]> {
    return this.service.getHumanResourcesRental(rentalId);
  }

  @Query(() => HumanResourcesData)
  async getHumanResources(
    @Args('input') input: QueryFilterDto,
  ): Promise<HumanResourcesData> {
    return this.service.getHumanResources(input);
  }

  @Query(() => HumanResourceData)
  async getHumanResourceById(
    @Args('id') id: string,
  ): Promise<HumanResourceData> {
    return this.service.getHumanResourceById(id);
  }

  @Roles(ROLE.Admin)
  @Mutation(() => ResponseMessageBase)
  async createHumanResource(
    @Args('input') input: CreateHumanResourcesRequest,
  ): Promise<ResponseMessageBase> {
    return this.service.createHumanResource(input);
  }

  @Roles(ROLE.Admin)
  @Mutation(() => ResponseMessageBase)
  async updateHumanResource(
    @Args('input') input: UpdateHumanResourcesRequest,
  ): Promise<ResponseMessageBase> {
    return this.service.updateHumanResource(input);
  }

  @Roles(ROLE.Admin)
  @Mutation(() => ResponseMessageBase)
  async deleteHumanResource(
    @Args('id') id: string,
  ): Promise<ResponseMessageBase> {
    return this.service.deleteHumanResource(id);
  }
}
