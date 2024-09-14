import { Module } from '@nestjs/common';
import { ContractResolver } from './contract.resolver';
import { ContractService } from './contract.service';
import { StripeModule } from '@/main/shared/stripe/stripe.module';
import { ContractRepository } from '@/db/repositories/contract.repository';

@Module({
  imports: [StripeModule],
  providers: [ContractResolver, ContractService, ContractRepository],
})
export class ContractModule {}
