import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { join } from 'path';
import { UploadModule } from '../shared/upload/upload.module';
import { AuthClientModule } from './auth/auth.module';
import { RoleModule } from '../admin/role/role.module';
import { UserModule } from '../shared/user/user.module';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { EventTypeModule } from '../shared/eventType/eventType.module';
import { ContractModule } from '../shared/contract/contract.module';
import { EventModule } from '../shared/event/event.module';
import { DeviceModule } from '../shared/device/device.module';
import { MailModule } from '../shared/mail/mail.module';
import { EmailSendLogModule } from '../shared/emailSendLog/emailSendLog.module';
import { GuestModule } from '../shared/guest/guest.module';
import { StripeModule } from '../shared/stripe/stripe.module';
import { LocationModule } from '../shared/location/location.module';
import { HumanResourceModule } from '../shared/humanResources/humanResource.module';
import { RentalModule } from '../shared/rental/rental.module';


@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      path: '/client',
      autoSchemaFile: join(process.cwd(), 'schemaClient.gql'),
      sortSchema: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
      formatError: (error: GraphQLError) => {
        const graphQLFormattedError: any = {
          statusCode: error.extensions?.exception?.code || 500,
          message: error.message,
        };
        return graphQLFormattedError;
      },
      include: [
        UploadModule,
        AuthClientModule,
        RoleModule,
        UserModule,
        EventTypeModule,
        EventModule,
        ContractModule,
        DeviceModule,
        GuestModule,
        EmailSendLogModule,
        StripeModule,
        MailModule,
        LocationModule,
        HumanResourceModule,
        RentalModule
      ],
    }),
    UploadModule,
    AuthClientModule,
    RoleModule,
    UserModule,
    EventTypeModule,
    EventModule,
    ContractModule,
    DeviceModule,
    MailModule,
    StripeModule,
    GuestModule,
    EmailSendLogModule,
    LocationModule,
    HumanResourceModule,
    RentalModule
  ],
})
export class ClientModule {}
