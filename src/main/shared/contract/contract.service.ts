import { getPaginationResponse } from '@/common/base/getPaginationResponse';
import { ROLE } from '@/common/constant';
import { StripeService } from '@/main/shared/stripe/stripe.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { ContractQueryCommand } from './command/ContractQuery.query';
import { DepositContractDto } from '@/main/shared/stripe/dto';
import { CONTRACT_STATUS, Contract } from '@/db/entities/contract.entity';
import { User } from '@/db/entities/user.entity';
import { ConfirmContractDeposit, UpdateContractStatusDto } from './dto';
import { ContractRepository } from '@/db/repositories/contract.repository';
import { getManager } from 'typeorm';
import { GetContractsRequest } from './dto/request/getContracts.request';

@Injectable()
export class ContractService {
  constructor(
    private stripeService: StripeService,
    private contractRepository: ContractRepository,
  ) {}
  // async getOne(id: string, info: GraphQLResolveInfo) {
  //   const relations = info ? Contract.getRelations(info) : [];

  //   return ContractQueryCommand.getOneById(id, true, relations);
  // }

  getContractDto = (contract: Contract) => {
    return {
      ...contract,
      rental: {
        ...contract.rental,
        devices: contract.rental.deviceRentals.map((deviceRental) => ({
          ...deviceRental.device,
          ...deviceRental,
          id: deviceRental.device.id,
        })),
        humanResources: contract.rental.humanResourcesRentals.map(
          (hrRental) => ({
            ...hrRental.humanResources,
            ...hrRental,
            id: hrRental.humanResources.id,
          }),
        ),
        locations: contract.rental.locationRentals.map((locationRental) => ({
          ...locationRental.location,
          ...locationRental,
          id: locationRental.location.id,
        })),
        timelines: contract.rental.timelines.map((timeline) => ({
          ...timeline,
          id: timeline.id,
          startTime: timeline.timeStart,
        })),
      },
    };
  };

  async getContractById(id: string) {
    return getManager().transaction(async (trx) => {
      const contract = await this.contractRepository.getContractById(id, trx);

      return this.getContractDto(contract);
    });
  }

  async getContracts(query: GetContractsRequest) {
    return getManager().transaction(async (trx) => {
      const queryBuilder = this.contractRepository
        .getContractsQbOrderByTimeline(trx)
        .orderBy('contract.updatedAt', 'DESC');

      const queryBuilderFilter = this.contractRepository.getContractFilterQb(
        query,
        queryBuilder,
      );

      const contracts = await getPaginationResponse(queryBuilderFilter, query);
      //
      return {
        ...contracts,
        items: contracts.items.map(this.getContractDto),
      };
    });
  }

  async getMyContracts(query: GetContractsRequest, user: User) {
    return getManager().transaction(async (trx) => {
      const queryBuilder = this.contractRepository.getMyContractsQb(
        user.id,
        trx,
      );

      const queryBuilderFilter = this.contractRepository.getContractFilterQb(
        query,
        queryBuilder,
      );

      const contracts = await getPaginationResponse(queryBuilderFilter, query);
     // console.log(queryBuilder.getQueryAndParameters()) //đây nè
      return {
        ...contracts,
        items: contracts.items.map(this.getContractDto),
      };
    });
  }

  async confirmContractDeposit(input: ConfirmContractDeposit, user: User) {
    const currentUser = await User.findOne({
      where: { id: user.id },
      relations: ['role'],
    });

    const { contractId, isApproved } = input;
    const contract = await ContractQueryCommand.getOneById(contractId, true, [
      'rental',
      'rental.user',
    ]);

    if (contract.status !== CONTRACT_STATUS.DepositPaid) {
      throw new BadRequestException(
        'Trạng thái hợp đồng không hợp lệ. Vui lòng thực hiện hoạt động khác',
      );
    }

    if (
      contract.rental.userId !== currentUser.id &&
      currentUser.role.name !== ROLE.Admin
    ) {
      throw new BadRequestException(
        'Bạn không có quyền chỉnh sửa trạng thái của hợp đồng',
      );
    }

    switch (currentUser.role.name) {
      case ROLE.Admin:
        contract.status = CONTRACT_STATUS.InProgress;
        if (!isApproved) {
          contract.status = CONTRACT_STATUS.AdminCancel;
          await this.stripeService.handleRefundContractDeposit(contract);
        }

        break;
      default:
        if (!isApproved) {
          contract.status = CONTRACT_STATUS.Cancel;
        }
    }

    return Contract.save(contract);
  }

  async updateStatusContract(input: UpdateContractStatusDto) {
    const contract = await ContractQueryCommand.getOneById(
      input.contractId,
      true,
      ['rental', 'rental.user'],
    );

    switch (input.status) {
      case CONTRACT_STATUS.InProgress:
        if (contract.status !== CONTRACT_STATUS.DepositPaid) {
          throw new BadRequestException('Hợp đồng vẫn chưa đặt cọc!');
        }

        break;
      case CONTRACT_STATUS.WaitingPaid:
        if (dayjs(new Date()).isBefore(contract.rental.rentalEndTime)) {
          throw new BadRequestException(
            'Hạn thuê của hợp đồng vẫn chưa kết thúc. Vui lòng thử lại sau khi hợp đồng kết thúc',
          );
        }

        break;

      case CONTRACT_STATUS.Completed:
        break;
    }

    contract.status = input.status;
    Contract.save(contract);

    return contract;
  }

  async checkoutRemainBillingContract(input: DepositContractDto, user: User) {
    const { contractId, ...rest } = input;
    const contract = await Contract.findOne({
      where: { id: contractId },
      relations: ['contractServiceItems'],
    });

    if (!contract) {
      throw new BadRequestException('Hợp đồng không tồn tại');
    }

    if (contract.status !== CONTRACT_STATUS.WaitingPaid) {
      throw new BadRequestException(
        'Trạng thái của hợp đồng không hợp lệ. Vui lòng thực hiện hành động này sau khi hợp đồng có hiệu lực',
      );
    }

    if (!contract.paymentIntentId) {
      throw new BadRequestException('Hợp đồng chưa được đặt cọc');
    }
    //tự fix
    if(contract.paymentIntentId){
      contract.status = CONTRACT_STATUS.DepositPaid;
      await this.stripeService.checkoutRemainBillingContract(contract,rest,user);
    }

    return await this.stripeService.checkoutRemainBillingContract(
      contract,
      rest,
      user,
    );
  }
}
