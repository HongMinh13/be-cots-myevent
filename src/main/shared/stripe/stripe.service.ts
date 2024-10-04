import { DEPOSIT_PERCENT, TIMEZONE, WEBHOOK_TYPE } from '@/common/constant';
import { configuration } from '@/config';
import { BadRequestException, Injectable } from '@nestjs/common';
import { WEBHOOK_EVENT_TYPE } from './command/constraint';
import { RequestWithRawBody } from './interface';
import { DepositContractDto } from './dto';

import _ from 'lodash';
import dayjs from 'dayjs';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { StripeAdapter } from '@/service/stripe';
import { getManager } from 'typeorm';
import Stripe from 'stripe';

import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';
import { EmailService } from '@/service/smtp/service';
import { CONTRACT_STATUS, Contract } from '@/db/entities/contract.entity';
import { User } from '@/db/entities/user.entity';
import { DeviceRental } from '@/db/entities/deviceRental.entity';
import { HumanResourcesRental } from '@/db/entities/humanResourcesRental.entity';
import { LocationRental } from '@/db/entities/locationRental.entity';

dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class StripeService {
  private stripeAdapter: StripeAdapter;
  private emailService: EmailService;
  constructor(private scheduleRegister: SchedulerRegistry) {
    this.stripeAdapter = new StripeAdapter();
    this.emailService = new EmailService();
  }

  public async handleConnectWebhooks(
    signature: string,
    request: RequestWithRawBody,
    webhookType: WEBHOOK_TYPE,
  ) {
    console.log('WebhookSignature', signature);
    if (!signature) {
      return {
        statusCode: 500,
        message: 'Missing stripe-signature header',
      };
    }

    try {
      const webhookSecret = this.getWebhookSecretKey(webhookType);

      const event: any = this.constructEventFromPayload(
        signature,
        request.body,
        webhookSecret,
      );

      switch (event.type) {
        case WEBHOOK_EVENT_TYPE.CHECKOUT_SESSION.COMPLETED:
        case WEBHOOK_EVENT_TYPE.CHECKOUT_SESSION.ASYNC_PAYMENT_SUCCEEDED: {
          await this.handleCheckoutSuccessfully(event);
          break;
        }
      }
      return {
        statusCode: 200,
        message: JSON.stringify({
          received: true,
        }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: `Webhook Error: ${error.message}`,
      };
    }
  }

  async handleRefundContractDeposit(contract: Contract) {
    if (!contract.rental.rentalStartTime) {
      throw new BadRequestException(
        'Không thể thực hiện hoàn tiền đối với hợp đồng vẫn chưa đặt cọc!',
      );
    }

    const paymentIntent = (await this.stripeAdapter.getPaymentIntent(
      contract.paymentIntentId,
    )) as any;

    await this.stripeAdapter.createRefund({
      chargeId: paymentIntent.latest_charge as string,
    });
  }

  handleCheckoutSuccessfully(event: Stripe.Event) {
    const object = event.data.object as Stripe.Checkout.Session;

    if (object.payment_status === 'paid') {
      const { contractId, status } = object.metadata;

      if (!contractId) {
        throw new BadRequestException(
          'Cannot find contract id for paymentIntent: ' + object.payment_intent,
        );
      }

      return getManager().transaction(async (trx) => {
        const contract = await trx
          .getRepository(Contract)
          .createQueryBuilder('contract')
          .leftJoinAndSelect('contract.rental', 'rental')
          .where('contract.id = :contractId', { contractId })
          .getOne();

        contract.status = status as unknown as CONTRACT_STATUS;
        contract.paymentIntentId = object.payment_intent as string;
        await trx.getRepository(Contract).save(contract);

        try {
          const date = dayjs
            .tz(`${contract.rental.rentalStartTime}`, TIMEZONE)
            .format();

          const job = new CronJob(
            new Date(date),
            async () => {
              const cronContract = await Contract.findOne({ id: contract.id });

              if (cronContract.status === CONTRACT_STATUS.InProgress) {
                await this.handleRefundContractDeposit(cronContract);
                contract.status = CONTRACT_STATUS.AdminCancel;
                await Contract.save(cronContract);
              }
            },
            null,
            true,
          );

          this.scheduleRegister.addCronJob(
            `schedule-${date}-${contractId}`,
            job,
          );
        } catch (error) {
          console.log(
            '🚀 ~ file: stripe.service.ts:316 ~ StripeService ~s error:',
            error,
          );
        }
      });
    }
  }

  getWebhookSecretKey(webhookType: WEBHOOK_TYPE) {
    switch (webhookType) {
      case WEBHOOK_TYPE.CAMILLE_ACCOUNT:
        return configuration.stripe.camille_secret_key;
        
    }
  }

  constructEventFromPayload(
    signature: string,
    payload: Buffer,
    secretKey: string,
  ) {
    return this.stripeAdapter.constructEvent(signature, payload, secretKey);
  }

  async createDeviceRentalProduct(rentalId: string) {
    const deviceRentals = await DeviceRental.createQueryBuilder()
      .leftJoinAndSelect('DeviceRental.device', 'device')
      .where('DeviceRental.rentalId = :rentalId', { rentalId })
      .getMany();

    const products = deviceRentals.map((deviceRental) => {
      return {
        id: deviceRental.device.id,
        name: deviceRental.device.name,
        price: deviceRental.device.hourlyRentalFee,
        image: deviceRental.device.img,
        quantity: deviceRental.quantity,
      };
    });

    return products;
  }

  async createHumanResourceRentalProduct(rentalId: string) {
    const humanResourcesRentals =
      await HumanResourcesRental.createQueryBuilder()
        .leftJoinAndSelect(
          'HumanResourcesRental.humanResources',
          'humanResource',
        )
        .where('HumanResourcesRental.rentalId = :rentalId', { rentalId })
        .getMany();

    const products = humanResourcesRentals.map((humanResourceRental) => {
      return {
        id: humanResourceRental.humanResources.id,
        name: humanResourceRental.humanResources.name,
        price: humanResourceRental.humanResources.hourlySalary,
        image: humanResourceRental.humanResources.img,
        quantity: humanResourceRental.quantity,
      };
    });

    return products;
  }

  async createLocationRentalProduct(rentalId: string) {
    const locationRentals = await LocationRental.createQueryBuilder()
      .leftJoinAndSelect('LocationRental.location', 'location')
      .where('LocationRental.rentalId = :rentalId', { rentalId })
      .getMany();

    const products = locationRentals.map((locationRental) => {
      return {
        id: locationRental.location.id,
        name: locationRental.location.name,
        price: locationRental.location.hourlyRentalFee,
        image: locationRental.location.img,
        quantity: 1,
      };
    });

    return products;
  }

  async depositContract(input: DepositContractDto, user: User) {
    const { contractId, successUrl, cancelUrl } = input;
    const contract = await Contract.createQueryBuilder()
      .where('Contract.id = :contractId AND Contract.status = :status', {
        contractId,
        status: CONTRACT_STATUS.Draft,
      })
      .getOne();

    if (!contract) {
      throw new BadRequestException('Hợp đồng đặt cọc không tồn tại');
    }

    return getManager().transaction(async () => {
      const deviceProducts = await this.createDeviceRentalProduct(
        contract.rentalId,
      );
      const humanResourceProducts = await this.createHumanResourceRentalProduct(
        contract.rentalId,
      );
      const locationProducts = await this.createLocationRentalProduct(
        contract.rentalId,
      );

      const items = [
        ...deviceProducts,
        ...humanResourceProducts,
        ...locationProducts,
      ];

      const products: Record<
        string,
        { price: number; product: Stripe.Product }
      > = {};

      for (const item of items) {
        const product = await this.stripeAdapter.createProduct({
          productName: item.name,
          productSystemId: item.id,
          imageUrls: item.image ? [item.image] : [],
          description: `Deposit 30% of ${item.price}đ`,
        });
       
        products[item.id] = {
          product,
          price: item.price,
        };
      }
     

      const lines = Object.keys(products).map((id) => {
        const productItem = items.find((serviceItem) => serviceItem.id === id);

        return {
          amount: products[id].price * DEPOSIT_PERCENT,
          currency: 'vnd',
          product: products[id].product.id,
          quantity: productItem.quantity,
        };
      });

      const lineItems = await this.stripeAdapter.createLineItems(lines);

      const result = await this.stripeAdapter.createCheckoutSession({
        successUrl,
        cancelUrl,
        mode: 'payment',
        lineItems,
        emailCustomer: user.email,
        metadata: {
          contractId,
          status: CONTRACT_STATUS.DepositPaid,
        },
      });

      return {
        checkoutUrl: result.url,
        successUrl: result.success_url,
        cancelUrl: result.cancel_url,
      };
    });
  }

  checkoutRemainBillingContract(
    contract: Contract,
    rest: Partial<Omit<DepositContractDto, 'contractId'>>,
    user: User,
  ) {
    return getManager().transaction(async () => {
      const deviceProducts = await this.createDeviceRentalProduct(
        contract.rentalId,
      );
      const humanResourceProducts = await this.createHumanResourceRentalProduct(
        contract.rentalId,
      );
      const locationProducts = await this.createLocationRentalProduct(
        contract.rentalId,
      );

      const items = [
        ...deviceProducts,
        ...humanResourceProducts,
        ...locationProducts,
      ];
      const products: Record<
        string,
        { price: number; product: Stripe.Product }
      > = {};

      for (const item of items) {
        const product = await this.stripeAdapter.createProduct({
          productName: item.name,
          productSystemId: item.id,
          imageUrls: item.image ? [item.image] : [],
          description: `Deposit 70% of ${item.price}đ`,
        });

        products[item.id] = {
          product,
          price: item.price,
        };
      }

      const lines = Object.keys(products).map((id) => {
        const productItem = items.find((serviceItem) => serviceItem.id === id);

        return {
          amount: products[id].price * (1 - DEPOSIT_PERCENT),
          currency: 'vnd',
          product: products[id].product.id,
          quantity: productItem.quantity,
        };
      });

      const lineItems = await this.stripeAdapter.createLineItems(lines);

      const result = await this.stripeAdapter.createCheckoutSession({
        successUrl: rest.successUrl,
        cancelUrl: rest.cancelUrl,
        mode: 'payment',
        lineItems,
        emailCustomer: user.email,
        metadata: {
          contractId: contract.id,
          status: CONTRACT_STATUS.Completed,
        },
      });

      return {
        checkoutUrl: result.url,
        successUrl: result.success_url,
        cancelUrl: result.cancel_url,
      };
    });
  }

  async getBalanceOfAdmin() {
    return this.stripeAdapter.getBalances();
  }
}
