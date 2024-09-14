import { PaginationInterface } from '@/common/interfaces/pagination';
import { ObjectType } from '@nestjs/graphql';
import { DeviceData } from './device.response';

@ObjectType({ isAbstract: true })
export class DevicesData extends PaginationInterface<DeviceData>(DeviceData) {}
