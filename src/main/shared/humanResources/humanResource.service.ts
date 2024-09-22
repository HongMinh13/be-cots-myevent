import { getPaginationResponse } from '@/common/base/getPaginationResponse';
import { GetServicesRequest } from '@/common/dtos/getServices.request';
import { ResponseMessageBase } from '@/common/interfaces/returnBase';
import { HumanResourcesRentalRepository } from '@/db/repositories/humanResourceRental.repository';
import { HumanResourcesRepository } from '@/db/repositories/humanResources.repository';
import { Injectable } from '@nestjs/common';
import { getManager } from 'typeorm';
import { HumanResourcesData } from './dto/response/humanResources.response';
import {
  CreateHumanResourcesRequest,
  UpdateHumanResourcesRequest,
} from './dto/request/createHumanResources.request';
import { HumanResourceRentalData } from './dto/response/humanResourceRental.response';
import { QueryFilterDto } from '@/common/dtos/queryFilter';

@Injectable()
export class HumanResourceService {
  constructor(
    private readonly humanResourceRepository: HumanResourcesRepository,
    private readonly humanResourceRentalRepository: HumanResourcesRentalRepository,
  ) {}

  async createHumanResource(
    input: CreateHumanResourcesRequest,
  ): Promise<ResponseMessageBase> {
    const trx = getManager();
    await this.humanResourceRepository.saveHumanResources(input, trx);

    return { message: 'Tạo mới nhân sự thành công', success: true };
  }

  async getHumanResourcesAvailable(
    input: GetServicesRequest,
  ): Promise<HumanResourcesData> {
    const { startTime, endTime } = input;

    const trx = getManager();
    const queryBuilder =
      this.humanResourceRepository.baseGetHumanResourcesAvailableQB(
        startTime,
        endTime,
        trx,
      );

    const humanResources = await getPaginationResponse(queryBuilder, input);

    return humanResources;
  }

  async getHumanResourcesRental(
    rentalId: string,
  ): Promise<HumanResourceRentalData[]> {
    const trx = getManager();
    const humanResourcesRental =
      await this.humanResourceRentalRepository.getHumanResourcesRentalByRentalId(
        rentalId,
        trx,
      );

    return humanResourcesRental.map((humanResourceRental) => {
      return {
        id: humanResourceRental.id,
        quantity: humanResourceRental.quantity,
        humanResource: humanResourceRental.humanResources,
      };
    });
  }

  async getHumanResources(input: QueryFilterDto): Promise<HumanResourcesData> {
    const trx = getManager();
    const queryBuilder = this.humanResourceRepository.getHumanResourcesQb(trx);

    const humanResources = await getPaginationResponse(queryBuilder, input);

    return humanResources;
  }

  async updateHumanResource(
    input: UpdateHumanResourcesRequest,
  ): Promise<ResponseMessageBase> {
    const { id, ...humanResourceData } = input;

    const trx = getManager();
    await this.humanResourceRepository.updateHumanResources(
      id,
      humanResourceData,
      trx,
    );

    return { message: 'cập nhật nhân sự thành công', success: true };
  }

  async getHumanResourceById(id: string) {
    const trx = getManager();
    const humanResource = await this.humanResourceRepository.getHumanResourceId(
      id,
      trx,
    );

    return humanResource;
  }

  async deleteHumanResource(id: string): Promise<ResponseMessageBase> {
    const trx = getManager();
    const humanResource = await this.humanResourceRepository.getHumanResourceId(
      id,
      trx,
    );

    if (!humanResource) {
      return { message: 'Không tìm thấy nhân sự', success: false };
    }

    const isHumanResourceRented =
      await this.humanResourceRepository.checkHumanResourcesInUse(id, trx);

    if (isHumanResourceRented) {
      return {
        message: 'Nhân sự này đã được thuê và không thể xóa',
        success: false,
      };
    }

    await this.humanResourceRepository.deleteHumanResources(id, trx);

    return { message: 'Xóa nhân sự thành công', success: true };
  }
}
